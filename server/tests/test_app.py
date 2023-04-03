import unittest
from flask_testing import TestCase
import server.app as appp
import server.db as db


class TestApp(TestCase):
    def create_app(self):
        app = appp.create_app()
        app.config['TESTING'] = True
        app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///:memory:'
        return app
    
    def setUp(self):
        db.create_all()

    def tearDown(self):
        db.session.remove()
        db.drop_all()

if __name__ == '__main__':
    unittest.main()

    
