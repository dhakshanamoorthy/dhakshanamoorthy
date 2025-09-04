# This is a helper script to verify database state for testing.
from app import create_app, db
from app.models import Transaction
import sys

# This allows us to pass a command to the script
# e.g., python verify_db.py count
command = sys.argv[1] if len(sys.argv) > 1 else "count"

app = create_app()

with app.app_context():
    if command == "count":
        count = db.session.query(Transaction).count()
        print(f"TRANSACTION_COUNT={count}")
    elif command == "cleanup":
        try:
            num_deleted = db.session.query(Transaction).delete()
            db.session.commit()
            print(f"Cleaned up {num_deleted} transactions.")
        except Exception as e:
            print(f"Error during cleanup: {e}")
            db.session.rollback()
    else:
        print(f"Unknown command: {command}")
