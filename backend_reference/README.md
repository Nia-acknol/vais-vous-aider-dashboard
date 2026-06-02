# Backend Reference - SMARTBRAISE RDC
This directory contains the Python/Flask backend structure as requested.

## 1. models.py (SQLAlchemy Schema)
```python
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash

db = SQLAlchemy()

class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(256), nullable=False)
    role = db.Column(db.String(20), default='CLIENT') # ADMIN or CLIENT
    
    def set_password(self, password):
        self.password_hash = generate_password_hash(password)
        
    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

class Order(db.Model):
    __tablename__ = 'orders'
    id = db.Column(db.Integer, primary_key=True)
    client_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    weight = db.Column(db.String(10), nullable=False) # 10kg, 25kg, 50kg
    quantity = db.Column(db.Integer, nullable=False)
    service_type = db.Column(db.String(20), nullable=False) # Livraison or Retrait
    total_price = db.Column(db.Float, nullable=False)
    deposit_paid = db.Column(db.Float, default=0.0)
    status = db.Column(db.String(30), default='En attente')
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class StockItem(db.Model):
    __tablename__ = 'stocks'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    item_type = db.Column(db.String(20), nullable=False) # PRODUCT or MATERIAL
    quantity = db.Column(db.Float, nullable=False)
    unit = db.Column(db.String(20), nullable=False)
    threshold = db.Column(db.Float, nullable=False)

class ActivityLog(db.Model):
    __tablename__ = 'activity_logs'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    action = db.Column(db.String(255), nullable=False)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)
```

## 2. app.py (Entry Point)
```python
from flask import Flask, render_template, request, redirect, url_for, session, flash
from models import db, User, Order, StockItem, ActivityLog
import config

app = Flask(__name__)
app.config.from_object(config)
db.init_app(app)

@app.route('/')
def home():
    if 'user_id' not in session:
        return redirect(url_for('login'))
    return redirect(url_for('dashboard'))

# Authentication Routes (Simplified)
@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        user = User.query.filter_by(email=request.form['email']).first()
        if user and user.check_password(request.form['password']):
            session['user_id'] = user.id
            session['role'] = user.role
            return redirect(url_for('dashboard'))
        flash('Identifiants invalides')
    return render_template('login.html')

# Admin Routes
@app.route('/admin/dashboard')
def dashboard():
    if session.get('role') != 'ADMIN':
        return redirect(url_for('home'))
    orders = Order.query.all()
    stocks = StockItem.query.all()
    return render_template('admin/dashboard.html', orders=orders, stocks=stocks)

if __name__ == '__main__':
    app.run(debug=True)
```

## 3. requirements.txt
```
Flask==3.0.0
Flask-SQLAlchemy==3.1.1
psycopg2-binary==2.9.9
Werkzeug==3.0.1
bcrypt==4.0.1