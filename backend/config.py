import os

# Flask Configuration
SECRET_KEY = os.urandom(24)

# MySQL Configuration (Change if needed)
MYSQL_HOST = 'localhost'
MYSQL_USER = 'root'
MYSQL_PASSWORD = ''
MYSQL_DB = 'internship_db'
MYSQL_CURSORCLASS = 'DictCursor'
