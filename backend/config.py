from flask import Flask
from flask_mysqldb import MySQL

app = Flask(__name__)

# MySQL Configuration
app.config['MYSQL_HOST'] = 'localhost'
app.config['MYSQL_USER'] = 'root'
app.config['MYSQL_PASSWORD'] = ''  # Change this if you have a password
app.config['MYSQL_DB'] = 'your_database_name'
app.config['MYSQL_CURSORCLASS'] = 'DictCursor'

mysql = MySQL(app)
