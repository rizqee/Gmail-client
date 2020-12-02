import flask
import json
from flask import request, Blueprint, jsonify
from actions import traveler as actions
from flask_cors import cross_origin

traveler_blueprint = Blueprint('traveler', __name__)


@traveler_blueprint.route('/encrypt', methods=["POST"])
@cross_origin()
def encrypt():
    key = request.json['key']
    text = request.json['text']
    print(text)
    mode = request.json['mode']
    padding = request.json['padding']
    t = actions.traveler()
    
    if mode == "CBC":
        mode = actions.CBC
    elif mode == "COUNTER":
        mode = actions.COUNTER
    else:
        mode = actions.ECB
    
    r = t.encrypt(key,text, padding=padding, mode=mode)
    print(r)

    return jsonify({ "ciphertext" : r }), 200

@traveler_blueprint.route('/decrypt', methods=["POST"])
@cross_origin()
def decrypt():
    key = request.json['key']
    text = request.json['text']
    print(text)
    mode = request.json['mode']
    padding = request.json['padding']
    t = actions.traveler()
    
    if mode == "CBC":
        mode = actions.CBC
    elif mode == "COUNTER":
        mode = actions.COUNTER
    else:
        mode = actions.ECB
    
    r = t.decrypt(key,text, padding=padding, mode=mode)
    print(r)

    return jsonify({ "plaintext" : r }), 200
