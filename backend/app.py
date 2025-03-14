from flask import Flask
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

# Register Blueprints (Routes)
app.register_blueprint(auth_bp, url_prefix='/auth')
app.register_blueprint(internship_bp, url_prefix='/internships')

if __name__ == '__main__':
    app.run(debug=True)
