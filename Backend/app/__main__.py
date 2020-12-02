import flask
from flask import Flask, jsonify, send_from_directory
from flask_cors import cross_origin
from datetime import datetime
import config
import os

import config
from routes.traveler import traveler_blueprint
from routes.ecdsa import ecdsa_blueprint

app = Flask(__name__)
app.config['JSON_AS_ASCII'] = False

app.register_blueprint(traveler_blueprint, url_prefix='/traveler')
app.register_blueprint(ecdsa_blueprint, url_prefix='/ecdsa')

basedir = os.path.abspath(os.path.dirname(__file__))

@app.after_request
def after_request(response):
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type, Authorization')
    response.headers.add('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, OPTIONS')
    response.headers.add('Access-Control-Allow-Credentials', 'true')

    return response

@app.route('/', methods=['GET', 'POST'])
@cross_origin()
def get():
    current_time = datetime.now()
    return jsonify({"time": current_time })

app.run(port=config.PORT, host='0.0.0.0')

