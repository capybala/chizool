# coding: utf-8

from flask import Flask, render_template, url_for, redirect

app = Flask(__name__)
app.config.update({
    #'SERVER_NAME': 'chizool.capybala.com',
})
app.debug = True


def build_bookmarklet(bookmarklet_url):
    return ''.join((
        "javascript:(function(){",
        "var%20s;",
        "s=document.createElement('script');",
        "s.charset='utf-8';",
        "s.src='", bookmarklet_url, "';",
        "document.body.appendChild(s);",
        "})();",
    ))


@app.route('/')
def index():
    bookmarklet_url = url_for('static', filename='bookmarklet.js', _external=True)
    bookmarklet = build_bookmarklet(bookmarklet_url)
    return render_template('index.html', bookmarklet=bookmarklet)


@app.route('/bookmarklet.js')
def bookmarklet():
    return redirect(url_for('static', filename='bookmarklet.js'))


@app.route('/kml/')
def create():
    return 'create'


@app.route('/kml/<kml_hash>')
def detail(kml_hash):
    return 'detail'
