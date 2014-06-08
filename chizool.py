# coding: utf-8

from io import BytesIO
import xml.etree.ElementTree as ET

from flask import Flask, render_template, url_for, redirect, request


ET.register_namespace('atom', 'http://www.w3.org/2005/Atom')

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


def build_locations(form):
    locations = []
    for i in range(1000):
        if 'name{0}'.format(i) not in form:
            break

        locations.append({
            'name': form['name{0}'.format(i)],
            'address': form.get('address{0}'.format(i), ''),
            'uri': form.get('uri{0}'.format(i), ''),
            'lat': form.get('lat{0}'.format(i), ''),
            'lon': form.get('lon{0}'.format(i), ''),
        })

    return locations


def build_kml(locations):
    kml = ET.Element('kml', attrib={
        'xmlns': 'http://www.opengis.net/kml/2.2',
        'xmlns:atom': 'http://www.w3.org/2005/Atom',
    })
    document = ET.SubElement(kml, 'Document')
    for location in locations:
        placemark = ET.SubElement(document, 'Placemark')
        name = ET.SubElement(placemark, 'name')
        name.text = location['name']
        if location['lon'] and location['lat']:
            point = ET.SubElement(placemark, 'Point')
            coordinates = ET.SubElement(point, 'coordinates')
            coordinates.text = '{0},{1}'.format(location['lon'], location['lat'])
        if location['uri']:
            link = ET.SubElement(placemark, 'atom:link')
            link.text = location['uri']

    tree = ET.ElementTree(kml)

    f = BytesIO()
    tree.write(f, encoding='utf-8')

    return f.getvalue()


@app.route('/')
def index():
    bookmarklet_url = url_for('static', filename='bookmarklet.js', _external=True)
    bookmarklet = build_bookmarklet(bookmarklet_url)
    return render_template('index.html', bookmarklet=bookmarklet)


@app.route('/bookmarklet.js')
def bookmarklet():
    return redirect(url_for('static', filename='bookmarklet.js'))


@app.route('/kml/', methods=['POST'])
def create():
    locations = build_locations(request.form)
    kml_body = build_kml(locations)

    return kml_body


@app.route('/kml/<kml_hash>')
def detail(kml_hash):
    return 'detail'
