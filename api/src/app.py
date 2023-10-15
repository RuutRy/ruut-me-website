from datetime import datetime, timedelta
import os
import re
import string
import json
import smtplib
from email.message import EmailMessage
from bson.objectid import ObjectId

from flask import Flask, request, jsonify, abort
from flask.json import JSONEncoder
from flask_cors import CORS
from apiflask import APIFlask

from pprint import pprint

import pymongo
import pytz

from config import MONGO_URL, PORT
from config import SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASSWORD

TZ = pytz.timezone("Europe/Helsinki")
signup_start = TZ.localize(datetime(2023, 2, 9, 16))
signup_start_fuksi = TZ.localize(datetime(2023, 2, 9, 16))


class CustomJSONEncoder(JSONEncoder):
    def default(self, obj):
        if isinstance(obj, datetime):
            return obj.isoformat()
        if isinstance(obj, ObjectId):
            return str(obj)
        return JSONEncoder.default(self, obj)


mongo_client = pymongo.MongoClient(MONGO_URL)
db = mongo_client.get_database()

app = Flask(__name__)
#app = APIFlask(__name__, spec_path='/openapi.yaml')
CORS(app)
app.json_encoder = CustomJSONEncoder
#app.config['SPEC_FORMAT'] = 'yaml'


@app.route("/")
def index():
    return "OK"


@app.route("/join", methods=["POST"])
def join():
    data = request.get_json()
    if data is None:
        return "No data", 400

    form_fields = [
        ("name", str),
        ("hometown", str),
        ("ltky", bool),
        ("study", str),
        ("study-other", str),
        ("email", str),
        ("gdpr", bool),
    ]

    s = [
        field not in data or not isinstance(data[field], type)
        for (field, type) in form_fields
    ]
    print(s)

    # if any(s):
    #   return jsonify({
    #     'message': 'Puutteellinen tai muuten virheellinen lomake.',
    #     'retry': True,
    #   }), 400

    if not data["gdpr"]:
        return (
            jsonify(
                {
                    "message": "Sinun tulee hyäksyä tietojen käsittely GDPRn mukaisesti, jotta voit liittyä.",
                    "retry": True,
                }
            ),
            400,
        )

    signup = {}

    for field, _ in form_fields:
        if field in data:
            signup[field] = data[field]

    result = db["signups"].insert_one(signup)

    try:
        msg = EmailMessage()
        msg.set_content(
            "\n".join(
                f"{str(key)}: {str(value)}"
                for key, value in signup.items()
                if key != "_id"
            )
        )
        msg["Subject"] = f'RUUT liittyminen: {signup["name"]}'
        msg["From"] = f"ruut-ilmot@ruut.me"
        msg["To"] = "ruut.mem@gmail.com"
        # msg["To"] = "juho.heiskanen@gmail.com"

        with smtplib.SMTP(SMTP_HOST, SMTP_PORT) as s:
            s.login(SMTP_USER, SMTP_PASSWORD)
            s.send_message(msg)

    except Exception as ex:
        print("Could not send email, reverting...")
        print(ex)
        try:
            db["signups"].delete_one({"_id": result.inserted_id})
        except Exception as ex:
            print(f'Could not revert signup for {signup["name"]}')
            print(ex)
        return jsonify({"message": "Sisäinen virhe", "retry": "true"}), 400

    return jsonify(
        {
            "message": "Kiitos liittymisestäsi. Saat tiedon sähköpostiisi, kun liittymisesi on käsitelty."
        }
    )


@app.route("/lagfest-signup-fuksi", methods=["POST"])
def lagfest_signup_fuksi():
    now = datetime.now(tz=TZ)
    if now < signup_start_fuksi:
        return (
            jsonify({"message": "Ilmoittautuminen ei ole vielä auki", "retry": True}),
            400,
        )

    data = request.get_json()
    if not data:
        return (
            jsonify({"message": "Et antanut mitään tietoja", "retry": False}),
            400,
        )

    form_fields = [
        ("name", str),
        ("email", str),
        ("yell", str),
        ("ticket", str),
        ("gdpr", bool),
    ]

    s = [
        field not in data or not isinstance(data[field], type)
        for (field, type) in form_fields
    ]

    # if any(s):
    #   return jsonify({
    #     'message': 'Puutteellinen tai muuten virheellinen lomake.',
    #     'retry': True,
    #   }), 400

    if not data["gdpr"]:
        return (
            jsonify(
                {
                    "message": "Sinun tulee hyäksyä tietojen käsittely GDPRn mukaisesti, jotta voit ilmoittautua.",
                    "retry": True,
                }
            ),
            400,
        )

    if not re.match(r"^.*@student.l(ut|ab).fi$", data["email"], flags=re.I):
        if now < signup_start_fuksi + timedelta(hours=48):
            return (
                jsonify(
                    {
                        "message": 'Voit ilmoittautua vasta 48 tuntia myöhemmin, jos sähköpostisi ei ole muotoa "@student.lut.fi" tai "@student.lab.fi".',
                        "retry": True,
                    }
                ),
                400,
            )

    signup = {}

    for field, _ in form_fields:
        if field in data:
            signup[field] = data[field]

    signup["time"] = datetime.now(tz=TZ)

    result = db["lagfest-signups-fuksit"].insert_one(signup)

    try:
        msg = EmailMessage()
        msg.set_content(
            "\n".join(
                f"{str(key)}: {str(value)}"
                for key, value in signup.items()
                if key != "_id"
            )
        )
        msg["Subject"] = f'Lagfest ilmo: {signup["name"]}'
        msg["From"] = f"lagfest-ilmot-fuksit@ruut.me"
        msg["To"] = "ruut.mem@gmail.com"
        # msg['To'] = 'juho.heiskanen@gmail.com'

        with smtplib.SMTP(SMTP_HOST, SMTP_PORT) as s:
            s.login(SMTP_USER, SMTP_PASSWORD)
            s.send_message(msg)

    except Exception as ex:
        print("Could not send email, reverting...")
        print(ex)
        try:
            db["lagfest-signups-fuksit"].delete_one({"_id": result.inserted_id})
        except Exception as ex:
            print(f'Could not revert signup for {signup["name"]}')
            print(ex)
        return jsonify({"message": "Sisäinen virhe", "retry": "true"}), 400

    return jsonify({"message": "Kiitos ilmoittautumisestasi!"})


@app.route("/lagfest-signup", methods=["POST"])
def lagfest_signup():
    now = datetime.now(tz=TZ)
    if now < signup_start:
        return (
            jsonify({"message": "Ilmoittautuminen ei ole vielä auki", "retry": True}),
            400,
        )

    data = request.get_json()
    if not data:
        return (
            jsonify({"message": "Et antanut mitään tietoja", "retry": False}),
            400,
        )

    form_fields = [
        ("name", str),
        ("email", str),
        ("yell", str),
        ("ticket", str),
        ("gdpr", bool),
    ]

    s = [
        field not in data or not isinstance(data[field], type)
        for (field, type) in form_fields
    ]

    # if any(s):
    #   return jsonify({
    #     'message': 'Puutteellinen tai muuten virheellinen lomake.',
    #     'retry': True,
    #   }), 400

    if not data["gdpr"]:
        return (
            jsonify(
                {
                    "message": "Sinun tulee hyäksyä tietojen käsittely GDPRn mukaisesti, jotta voit ilmoittautua.",
                    "retry": True,
                }
            ),
            400,
        )

    if not re.match(r"^.*@student.l(ut|ab).fi$", data["email"], flags=re.I):
        if now < signup_start + timedelta(hours=1):
            return (
                jsonify(
                    {
                        "message": 'Voit ilmoittautua vasta tuntia myöhemmin, jos sähköpostisi ei ole muotoa "@student.lut.fi" tai "@student.lab.fi".',
                        "retry": True,
                    }
                ),
                400,
            )

    signup = {}

    for field, _ in form_fields:
        if field in data:
            signup[field] = data[field]

    signup["time"] = datetime.now(tz=TZ)

    result = db["lagfest-signups"].insert_one(signup)

    try:
        msg = EmailMessage()
        msg.set_content(
            "\n".join(
                f"{str(key)}: {str(value)}"
                for key, value in signup.items()
                if key != "_id"
            )
        )
        msg["Subject"] = f'Lagfest ilmo: {signup["name"]}'
        msg["From"] = f"lagfest-ilmot@ruut.me"
        msg["To"] = "ruut.mem@gmail.com"
        # msg['To'] = 'juho.heiskanen@gmail.com'

        with smtplib.SMTP(SMTP_HOST, SMTP_PORT) as s:
            s.login(SMTP_USER, SMTP_PASSWORD)
            s.send_message(msg)

    except Exception as ex:
        print("Could not send email, reverting...")
        print(ex)
        try:
            db["lagfest-signups"].delete_one({"_id": result.inserted_id})
        except Exception as ex:
            print(f'Could not revert signup for {signup["name"]}')
            print(ex)
        return jsonify({"message": "Sisäinen virhe", "retry": "true"}), 400

    return jsonify({"message": "Kiitos ilmoittautumisestasi!"})


@app.route("/signups", methods=["GET"])
def get_lagfest_signups():
    signups = list(
        db["lagfest-signups"]
        .find({}, {"name": 1, "yell": 1, "_id": 0})
        .sort("time", pymongo.ASCENDING)
    )

    return jsonify(signups)


@app.route("/signups-fuksit", methods=["GET"])
def get_lagfest_signups_fuksit():
    signups = list(
        db["lagfest-signups-fuksit"]
        .find({}, {"name": 1, "yell": 1, "_id": 0})
        .sort("time", pymongo.ASCENDING)
    )

    return jsonify(signups)


if __name__ == "__main__":
    print("Starting API server")
    app.run(host="0.0.0.0", port=int(PORT))
