"""
The flask application package.
"""
import os
from flask import Flask
from flask_login import LoginManager

app = Flask(__name__)
login = LoginManager(app)

app.secret_key = os.urandom(24)

import webapp.routes
