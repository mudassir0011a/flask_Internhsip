from flask import Blueprint, request, jsonify, session
from extensions import mysql

internship_bp = Blueprint('internships', __name__)

# Get all internships
@internship_bp.route('/', methods=['GET'])
def get_internships():
    cursor = mysql.connection.cursor()
    cursor.execute("SELECT * FROM internships")
    internships = cursor.fetchall()
    cursor.close()
    return jsonify(internships)

# Post new internship (Recruiter Only)
@internship_bp.route('/post', methods=['POST'])
def post_internship():
    if 'user_id' not in session or session['role'] != 'recruiter':
        return jsonify({'error': 'Unauthorized'}), 403

    data = request.json
    title = data.get('title')
    company = data.get('company')
    location = data.get('location')
    description = data.get('description')
    requirements = data.get('requirements')

    cursor = mysql.connection.cursor()
    cursor.execute("INSERT INTO internships (title, company, location, description, requirements, posted_by) VALUES (%s, %s, %s, %s, %s, %s)",
                   (title, company, location, description, requirements, session['user_id']))
    mysql.connection.commit()
    cursor.close()

    return jsonify({'message': 'Internship posted successfully'}), 201
