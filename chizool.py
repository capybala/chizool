# coding: utf-8

from flask import Flask

app = Flask(__name__)


@app.route('/')
def index():
    return 'Hello World!'


@app.route('/kml/')
def create():
    return 'create'


@app.route('/kml/<kml_hash>')
def detail(kml_hash):
    return 'detail'
