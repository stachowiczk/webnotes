"""
this will contain the api endpoints for the server

"""
from flask import Flask, request, jsonify, url_for
from flask_cors import CORS
from dbase_handler import DatabaseHandler as db
from sqlite3 import connect as sqlite_connect
from sqlalchemy import create_engine, sql

# create a new database if the database doesn't already exist



app = Flask(__name__)

CORS(app, origins='http://localhost:3000')


@app.route('/api/submit', methods=['POST'])
def submit():

    session = db()

    title = request.args.get('title')
    content = request.args.get('content')
    session.insert(title, content)
    return "success"


@app.route('/api/search', methods=['GET'])
def find():
    session = db()
    search_terms = request.args.get('query')
    db_find = session.find(search_terms)

    response = jsonify(db_find) 
    response.headers['Access-Control-Allow-Origin'] = 'http://localhost:3000'
    
    return response

if __name__ == '__main__':
    app.run(port=5000, debug=True)