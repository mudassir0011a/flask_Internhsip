import bcrypt
from flask import Flask, render_template, request, jsonify, session, redirect, url_for
from flask_cors import CORS
from extensions import mysql
from routes.auth_routes import auth_bp
from routes.internship_routes import internship_bp


app = Flask(__name__)
CORS(app)

# App Configuration
app.config.from_pyfile('config.py')

# Initialize MySQL
mysql.init_app(app)

print(mysql)
print(mysql.connection)

# Register Blueprints (Routes)
app.register_blueprint(auth_bp, url_prefix='/auth')
app.register_blueprint(internship_bp, url_prefix='/internships')

@app.route('/test_db')
def test_db():
    try:
        conn = mysql.connection
        if conn is None:
            return "MySQL connection failed!", 500
        cursor = conn.cursor()
        cursor.execute("SELECT DATABASE();")  # Test query
        db_name = cursor.fetchone()
        return f"Connected to {db_name}", 200
    except Exception as e:
        return str(e), 500

@app.route('/login')
def login():
    return render_template('login.html')

@app.route('/candidate_singup')
def candidate_signup():
    return render_template('candidate_signup.html')

@app.route('/company_signup', methods=['GET','POST'])
def company_signup():
    try:
        data = request.json  # Get JSON data from request

        # Extract fields from request
        company_name = data.get('company_name')
        company_email = data.get('company_email')
        password = data.get('password')
        contact_number = data.get('contact_number')
        industry_type = data.get('industry_type')
        company_logo = data.get('company_logo')
        company_description = data.get('company_description')
        terms_agreement = data.get('terms_agreement', True)

        # Validate required fields
        if not all([company_name, company_email, password, contact_number, industry_type, company_logo, company_description]):
            return jsonify({'error': 'All fields are required!'}), 400

        # Hash the password
        hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')

        # Check if email already exists
        cur = mysql.connection.cursor()
        cur.execute("SELECT * FROM companies WHERE company_email = %s", (company_email,))
        existing_company = cur.fetchone()

        if existing_company:
            return jsonify({'error': 'Email already registered!'}), 409  # Conflict error

        # Insert company details into database
        cur.execute("""
            INSERT INTO companies (company_name, company_email, password, contact_number, industry_type, company_logo, company_description, terms_agreement) 
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
        """, (company_name, company_email, hashed_password, contact_number, industry_type, company_logo, company_description, terms_agreement))

        mysql.connection.commit()  # Commit changes
        cur.close()

        return jsonify({'message': 'Company registered successfully!'}), 201  # Success

    except Exception as e:
        return jsonify({'error': str(e)}), 500  # Internal Server Error
@app.route('/')
def home():
    return render_template('index.html')

@app.route('/internships')
def internships():
    return render_template("internships.html")

@app.route('/about_us')
def about_us():
    return render_template("about_us.html")

@app.route('/contact_us')
def contact_us():
    return render_template("contact_us.html")

@app.route('/dashboard')
def dashboard():
    if 'logged_in' in session and session.get('role') == 'student':
        return render_template("dashboard.html")
    flash("Please log in first.", "warning")
    return redirect(url_for('login'))

@app.route('/recruiter')
def recruiter():
    if 'logged_in' in session and session.get('role') == 'recruiter':
        return render_template("recruiter.html")
    flash("Please log in first.", "warning")
    return redirect(url_for('login'))

# ✅ Internship Role Routes
@app.route('/internship_roles/software_role')
def software_role():
    return render_template("internship_roles/software_role.html")

@app.route('/internship_roles/data_analyst')
def data_analyst():
    return render_template("internship_roles/data_analyst.html")

@app.route('/internship_roles/ui_ux')
def ui_ux():
    return render_template("internship_roles/ui_ux.html")

@app.route('/internship_roles/marketing')
def marketing():
    return render_template("internship_roles/marketing.html")

@app.route('/internship_roles/graphic')
def graphic():
    return render_template("internship_roles/graphic.html")

@app.route('/internship_roles/content_writ')
def content_writ():
    return render_template("internship_roles/content_writ.html")

@app.route('/internship_roles/backend')
def backend():
    return render_template("internship_roles/backend.html")

@app.route('/internship_roles/frontend')
def frontend():
    return render_template("internship_roles/frontend.html")

@app.route('/internship_roles/digital_marketing')
def digital_marketing():
    return render_template("internship_roles/digital_marketing.html")

if __name__ == '__main__':
    app.run(debug=True)
