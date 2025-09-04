from flask import Blueprint, request, jsonify
import os
from werkzeug.utils import secure_filename
from . import services, db
from .models import Transaction
import datetime
from decimal import Decimal

bp = Blueprint('api', __name__, url_prefix='/api')

# Define the path for temporarily storing uploads
UPLOAD_FOLDER = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'uploads')
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

@bp.route('/upload', methods=['POST'])
def upload_and_process_files():
    """
    Handles multiple file uploads, sends them to the Gemini service for processing,
    and returns the structured data.
    """
    if 'files' not in request.files:
        return jsonify({'error': 'No "files" part in the request'}), 400

    files = request.files.getlist('files')

    if not files or all(f.filename == '' for f in files):
        return jsonify({'error': 'No selected files'}), 400

    processed_data = []
    failed_files = []

    for file in files:
        if file:
            filename = secure_filename(file.filename)
            filepath = os.path.join(UPLOAD_FOLDER, filename)

            try:
                file.save(filepath)

                # Call the Gemini processing service
                result = services.process_audio_file(filepath)

                if result['success']:
                    # Add the original filename for reference on the frontend
                    result['data']['original_filename'] = filename
                    processed_data.append(result['data'])
                else:
                    failed_files.append(result)

            except Exception as e:
                # Catch errors from file saving or other unexpected issues
                failed_files.append({
                    'success': False,
                    'error': str(e),
                    'file_path': filepath
                })
            finally:
                # Clean up the uploaded file after processing
                if os.path.exists(filepath):
                    os.remove(filepath)

    return jsonify({
        'processed_transactions': processed_data,
        'failed_files': failed_files
    }), 200


@bp.route('/save_transactions', methods=['POST'])
def save_transactions():
    """
    Receives a list of corrected transactions from the frontend
    and saves them to the database.
    """
    data = request.get_json()
    if not data:
        return jsonify({'error': 'No data provided'}), 400

    transactions_to_save = data.get('transactions')
    if not isinstance(transactions_to_save, list):
        return jsonify({'error': 'Invalid data format: "transactions" should be a list'}), 400

    errors = []

    for tx_data in transactions_to_save:
        try:
            # Basic validation
            if not all(k in tx_data for k in ['date', 'amount', 'category']) or tx_data['amount'] is None or tx_data['date'] is None:
                raise ValueError("Missing required fields (date, amount, category)")

            new_tx = Transaction(
                date=datetime.datetime.fromisoformat(tx_data['date'].split('T')[0]),
                amount=Decimal(tx_data['amount']),
                category=str(tx_data['category']),
                description=tx_data.get('description')
            )
            db.session.add(new_tx)
        except Exception as e:
            db.session.rollback() # Rollback on any error during the loop
            return jsonify({
                'message': 'An error occurred during transaction processing. No data was saved.',
                'error': str(e),
                'offending_transaction': tx_data
            }), 422

    try:
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': f'Database commit failed: {e}'}), 500

    return jsonify({
        'message': f'Successfully saved {len(transactions_to_save)} transactions.'
    }), 201 # Created


@bp.route('/transactions', methods=['GET'])
def get_transactions():
    """
    Fetches transactions from the database, optionally filtering by month and year.
    """
    month = request.args.get('month', type=int)
    year = request.args.get('year', type=int)

    # Start with a query on the Transaction model
    query = Transaction.query

    if year and month:
        from sqlalchemy import extract
        # Filter by year and month on the 'date' column
        query = query.filter(extract('year', Transaction.date) == year,
                             extract('month', Transaction.date) == month)

    # Order by date descending to show most recent first
    transactions = query.order_by(Transaction.date.desc()).all()

    return jsonify([tx.to_dict() for tx in transactions])
