"""
this file will handle all the database related operations
"""

import sqlite3

class DatabaseHandler:
    def __init__(self, db="db_main.db", data=None, search_terms=None):
        self.conn = sqlite3.connect(db)
        self.cur = self.conn.cursor()
        self.cur.execute("CREATE TABLE IF NOT EXISTS documents (id INTEGER PRIMARY KEY, title TINYTEXT, content TEXT, created_at DATETIME DEFAULT CURRENT_TIMESTAMP, tags TEXT)")
        self.conn.commit() 

    def dict_factory(self, cursor, row):
        d = {}
        for idx, col in enumerate(cursor.description):
            d[col[0]] = row[idx]
        return d

    def insert(self, title, content, tags=None):
        self.cur.execute("INSERT INTO documents (title, content, created_at, tags) VALUES (?, ?, CURRENT_TIMESTAMP, ?)", (title, content, tags))
        self.conn.commit()
        return self.cur.lastrowid

    def find(self, search_terms):
        self.cur.row_factory = self.dict_factory
        self.cur.execute("SELECT * FROM documents WHERE title LIKE ? OR content LIKE ? OR tags LIKE ?", (search_terms + '%', search_terms + '%', search_terms))
        rows = self.cur.fetchall()
        # cols = [column[0] for column in self.cur.description] 
        # return [dict(zip(cols, row)) for row in rows]
        return rows

    def find_by_id(self, id):
        self.cur.row_factory = self.dict_factory
        self.cur.execute("SELECT * FROM documents WHERE id=?", (id,))
        row = self.cur.fetchone()
        return row

    def delete(self, id):
        self.cur.execute("DELETE FROM documents WHERE id=?", (id,))
        self.conn.commit()

    def dropTable(self):
        self.cur.execute("DROP TABLE documents")
        self.conn.commit()
        

    def update(self, id, data):
        self.cur.execute("UPDATE documents SET title=?, content=?, tags=? WHERE id=?", (data.title, data.content, data.tags, id))
        self.conn.commit()

    def __del__(self):
        self.conn.close()

class DocumentRecord:
    def __init__(self, title=None, content=None, tags=None, created_at=None, id=None):
        self.id = id
        self.title = title
        self.content = content
        self.tags = tags
        self.created_at = created_at

    def __str__(self):
        return f"Title: {self.title}\nContent: {self.content}\nCreated at: {self.created_at}\nTags: {self.tags}"

    def __dict__(self):
        return {'title': self.title, 'content': self.content, 'created_at': self.created_at, 'tags': self.tags}

