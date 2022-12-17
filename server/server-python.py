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
app.testing = True

CORS(app, origins="http://localhost:3000")


def dict_factory(cursor, row):
    d = {}
    for idx, col in enumerate(cursor.description):
        d[col[0]] = row[idx]
    return d


@app.route("/api/submit", methods=["POST"])
def submit():

    session = db()

    title = request.args.get("title")
    content = request.args.get("content")
    insertedId = session.insert(title, content)
    return jsonify(insertedId)

def test_submit():
    session = db()
    insertedId = session.insert("test title", "test content")
    assert insertedId == 1


@app.route("/api/search", methods=["GET"])
def find():
    session = db()
    if request.args.get("query"):
        search_terms = request.args.get("query")
        db_find = session.find(search_terms)
    else:
        return "No search terms provided"

    if db_find:
        response = jsonify(db_find)
        return response
    else:
        return "No results found"


@app.route("/api/drop", methods=["GET"])
def drop():
    session = db()
    session.dropTable()
    return "success"

def test_drop():
    session = db()
    session.dropTable()
    assert True


if __name__ == "__main__":
    app.run(port=5000, debug=True)
    app.test_client()
