import flask
import json
from flask import request, Blueprint, jsonify
from actions import ecdsa as actions
from flask_cors import cross_origin

ecdsa_blueprint = Blueprint('ecdsa', __name__)


@ecdsa_blueprint.route('/key', methods=["GET"])
@cross_origin()
def generate_key():
    e = actions.ecdsa()
    
    pub_x, pub_y, pri = e.generate_key_pair()

    return jsonify({
        "pub_x" : pub_x,
        "pub_y" : pub_y, 
        "pri" : pri
        }), 200

@ecdsa_blueprint.route('/sign', methods=["POST"])
@cross_origin()
def sign():
    e = actions.ecdsa()
    pri = request.json['pri']
    message = request.json['message']
    
    r, s = e.generate_signature(message, pri)

    return jsonify({
        "r" : r,
        "s" : s
        }), 200

@ecdsa_blueprint.route('/verify', methods=["POST"])
@cross_origin()
def verify():
    e = actions.ecdsa()
    pub_x = request.json['pub_x']
    pub_y = request.json['pub_y']
    message = request.json['message']
    r = request.json['r']
    s = request.json['s']
    
    verified = e.verify_signature(message, pub_x, pub_y, r, s)

    return jsonify({
        "verified" : verified
        }), 200