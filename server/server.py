'''
from flask import Flask
from flask.ext.sqlalchemy import SQLAlchemy

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://localhost/glavin'
db = SQLAlchemy(app)
'''

from flask import request
from eve import Eve
app = Eve()

@app.before_request
def before():
    print('the request object ready to be processed:', request)

@app.after_request
def after(response):
    """
    Your function must take one parameter, a `response_class` object and return
    a new response object or the same (see Flask documentation).
    """
    print('and here we have the response object instead:', response)
    return response

if __name__ == '__main__':
    app.run(host='0.0.0.0')
