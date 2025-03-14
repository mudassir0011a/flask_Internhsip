from extensions import mysql

def get_db_cursor():
    return mysql.connection.cursor()
