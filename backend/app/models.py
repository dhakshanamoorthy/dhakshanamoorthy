from . import db
import datetime

class Transaction(db.Model):
    __tablename__ = 'transactions'

    id = db.Column(db.Integer, primary_key=True)
    date = db.Column(db.DateTime, nullable=False, default=datetime.datetime.utcnow)
    amount = db.Column(db.Numeric(10, 2), nullable=False)
    category = db.Column(db.String(100), nullable=False)
    description = db.Column(db.String(500), nullable=True)

    def to_dict(self):
        """Serializes the Transaction object to a dictionary."""
        return {
            'id': self.id,
            'date': self.date.isoformat(),
            'amount': str(self.amount),  # Convert Decimal to string for JSON
            'category': self.category,
            'description': self.description
        }
