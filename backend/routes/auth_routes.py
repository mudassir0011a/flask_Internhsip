from flask import Blueprint, request, jsonify, session
from extensions import mysql
import re

auth_bp = Blueprint('auth', __name__)

# Signup Route
@auth_bp.route('/signup', methods=['POST'])
def signup():
    data = request.json
    first_name = data.get('first_name')
    last_name = data.get('last_name')
    email = data.get('email')
    password = data.get('password')
    role = data.get('role')

    # Password Validation
    if not re.match(r'^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$', password):
        return jsonify({'error': 'Password must be at least 8 characters, include 1 number & 1 special character'}), 400

    cursor = mysql.connection.cursor()
    cursor.execute("INSERT INTO users (first_name, last_name, email, password, role) VALUES (%s, %s, %s, %s, %s)", 
                   (first_name, last_name, email, password, role))
    mysql.connection.commit()
    cursor.close()

    return jsonify({'message': 'User registered successfully'}), 201

# Login Route
@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.json
    email = data.get('email')
    password = data.get('password')

    cursor = mysql.connection.cursor()
    cursor.execute("SELECT id, role FROM users WHERE email = %s AND password = %s", (email, password))
    user = cursor.fetchone()
    cursor.close()

    if user:
        session['user_id'] = user['id']
        session['role'] = user['role']
        return jsonify({'message': 'Login successful', 'role': user['role']}), 200
    else:
        return jsonify({'error': 'Invalid email or password'}), 401
