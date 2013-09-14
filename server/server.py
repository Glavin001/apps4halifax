'''
from flask import Flask
from flask.ext.sqlalchemy import SQLAlchemy

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://localhost/glavin'
db = SQLAlchemy(app)
'''

from eve import Eve
app = Eve()

if __name__ == '__main__':
    app.run()