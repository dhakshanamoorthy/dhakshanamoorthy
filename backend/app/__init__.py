from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
import os

# Initialize extensions
db = SQLAlchemy()

def create_app():
    """Create and configure an instance of the Flask application."""
    app = Flask(__name__)
    # Enable CORS for all domains on all routes
    CORS(app)

    # Configure the database
    # Use an absolute path to avoid issues with the working directory
    basedir = os.path.abspath(os.path.dirname(os.path.dirname(__file__)))
    database_uri = 'sqlite:///' + os.path.join(basedir, 'expenses.db')
    print(f"DATABASE URI: {database_uri}")
    app.config['SQLALCHEMY_DATABASE_URI'] = database_uri
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    # Initialize extensions with the app
    db.init_app(app)

    with app.app_context():
        # Import models here to ensure they are registered with SQLAlchemy
        from . import models
        # Create database tables for all models
        db.create_all()

        # Import routes
        from . import routes
        app.register_blueprint(routes.bp)

    return app
