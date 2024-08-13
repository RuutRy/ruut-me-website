import azure.functions as func
import logging
import pytz
import json
import re
import uuid
from datetime import datetime, timedelta

app = func.FunctionApp(http_auth_level=func.AuthLevel.ANONYMOUS)
func.HttpResponse.mimetype = 'application/json'
func.HttpResponse.charset = 'utf-8'

TZ = pytz.timezone("Europe/Helsinki")
signup_start = TZ.localize(datetime(2024, 2, 22, 16))
signup_start_tatiseta = TZ.localize(datetime(2024, 8, 15, 16))

# Lagfest 
@app.function_name(name="lagfestSignup")
@app.route(route="lagfestSignup", auth_level=func.AuthLevel.ANONYMOUS, methods=["POST"])
@app.cosmos_db_output(arg_name="outputDocument", database_name="main",
                      container_name="ruut-lagfest", connection="COSMOS_CONNECTION_STRING")
def lagfestSignup(req: func.HttpRequest, outputDocument: func.Out[func.Document]) -> func.HttpResponse:
    now = datetime.now(tz=TZ)
    logging.info(
        f'Python HTTP trigger function processed a request. Time is {now}')

    if now < signup_start:
        logging.info('Returned 400 for too early submission')
        message = json.dumps(
            {"message": "Ilmoittautuminen ei ole viela auki", "retry": True})
        return func.HttpResponse(body=message,
                                 status_code=400)

    try:
        data = req.get_json()
    except:
        logging.info('Returned 400 for no data')
        message = json.dumps(
            {"message": "Et antanut mitaan tietoja", "retry": False})
        return func.HttpResponse(body=message,
                                 status_code=400)

    if not data:
        logging.info('Returned 400 for no data')
        message = json.dumps(
            {"message": "Et antanut mitaan tietoja", "retry": False})
        return func.HttpResponse(body=message,
                                 status_code=400)

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

    if any(s):
        logging.warning("Invalid data")
        message = json.dumps(
            {"message": "Puutteellinen tai muuten virheellinen lomake.", "retry": True})
        return func.HttpResponse(body=message,
                                 status_code=400)

    try:
        data["gdpr"]
    except:
        logging.warning("no gdpr data")
        message = json.dumps(
            {"message": "Sinun tulee hyvaksya tietojen kasittely GDPRn mukaisesti, jotta voit ilmoittautua.", "retry": True})
        return func.HttpResponse(body=message,
                                 status_code=400)

    if not data["gdpr"]:
        logging.info('Returned 400 for no gdpr agreement')
        message = json.dumps(
            {"message": "Sinun tulee hyvaksya tietojen kasittely GDPRn mukaisesti, jotta voit ilmoittautua.", "retry": True})
        return func.HttpResponse(body=message,
                                 status_code=400)
    try:
        re.match(r"^.*@student.l(ut|ab).fi$", data["email"], flags=re.I)
    except:
        logging.warning("No valid email")
        message = json.dumps(
            {"message": "No valid email.", "retry": True})
        return func.HttpResponse(body=message,
                                 status_code=400)

    if not re.match(r"^.*@student.l(ut|ab).fi$", data["email"], flags=re.I):
        if now < signup_start + timedelta(hours=2):
            logging.info('Returned 400 for too early for non student')
            message = json.dumps(
                {"message": 'Voit ilmoittautua vasta kaksi tuntia myohemmin, jos sähkopostisi ei ole muotoa "@student.lut.fi" tai "@student.lab.fi".', "retry": True})
            return func.HttpResponse(body=message,
                                     status_code=400)

    signup = {}

    for field, _ in form_fields:
        if field in data:
            signup[field] = data[field]

    signup["time"] = datetime.now(tz=TZ).isoformat()
    signup["id"] = uuid.uuid4().hex
    logging.info(f"{signup}")

    outputDocument.set(func.Document.from_dict(signup))

    logging.info(f"Successful submission for {data.get('name')}.")
    message = json.dumps({"message": "Kiitos ilmoittautumisestasi!"})
    return func.HttpResponse(body=message,
                             status_code=200)


@app.function_name(name="lagfest")
@app.route(route="lagfest", auth_level=func.AuthLevel.ANONYMOUS, methods=["GET"])
@app.cosmos_db_input(arg_name="documents",
                     database_name="main",
                     container_name="ruut-lagfest",
                     sql_query="SELECT * FROM c ORDER BY c.time ASC",
                     connection="COSMOS_CONNECTION_STRING")
def lagfest(req: func.HttpRequest, documents: func.DocumentList) -> func.HttpResponse:
    logging.info(f"Something {documents}")
    participants = []
    for doc in documents:
        participant = {"name": doc.get("name"), "yell": doc.get(
            "yell")}
        participants.append(participant)
    logging.info(f"result of {participants}")
    message = json.dumps(participants)
    return func.HttpResponse(body=message,
                             status_code=200)

# Tatiseta
@app.function_name(name="tatisetaSignup")
@app.route(route="tatisetaSignup", auth_level=func.AuthLevel.ANONYMOUS, methods=["POST"])
@app.cosmos_db_output(arg_name="outputDocument", database_name="main",
                      container_name="ruut-tatiseta", connection="COSMOS_CONNECTION_STRING")
def tatisetaSignup(req: func.HttpRequest, outputDocument: func.Out[func.Document]) -> func.HttpResponse:
    now = datetime.now(tz=TZ)
    logging.info(
        f'Python HTTP trigger function processed a request. Time is {now}')

    if now < signup_start_tatiseta:
        logging.info('Returned 400 for too early submission')
        message = json.dumps(
            {"message": "Ilmoittautuminen ei ole viela auki", "retry": True})
        return func.HttpResponse(body=message,
                                 status_code=400)

    try:
        data = req.get_json()
    except:
        logging.info('Returned 400 for no data')
        message = json.dumps(
            {"message": "Et antanut mitaan tietoja", "retry": False})
        return func.HttpResponse(body=message,
                                 status_code=400)

    if not data:
        logging.info('Returned 400 for no data')
        message = json.dumps(
            {"message": "Et antanut mitaan tietoja", "retry": False})
        return func.HttpResponse(body=message,
                                 status_code=400)

    form_fields = [
        ("name", str),
        ("email", str),
        ("yell", str),
        ("ticket", str),
        ("gdpr", bool),
        ("opiskelija",bool),
    ]

    s = [
        field not in data or not isinstance(data[field], type)
        for (field, type) in form_fields
    ]

    if any(s):
        logging.warning("Invalid data")
        message = json.dumps(
            {"message": "Puutteellinen tai muuten virheellinen lomake.", "retry": True})
        return func.HttpResponse(body=message,
                                 status_code=400)

    try:
        data["gdpr"]
    except:
        logging.warning("no gdpr data")
        message = json.dumps(
            {"message": "Sinun tulee hyvaksya tietojen kasittely GDPRn mukaisesti, jotta voit ilmoittautua.", "retry": True})
        return func.HttpResponse(body=message,
                                 status_code=400)

    if not data["opiskelija"]:
        data["opiskelija"] = False
        
    if not data["gdpr"]:
        logging.info('Returned 400 for no gdpr agreement')
        message = json.dumps(
            {"message": "Sinun tulee hyvaksya tietojen kasittely GDPRn mukaisesti, jotta voit ilmoittautua.", "retry": True})
        return func.HttpResponse(body=message,
                                 status_code=400)
    try:
        re.match(r"^.*@student.l(ut|ab).fi$", data["email"], flags=re.I)
    except:
        logging.warning("No valid email")
        message = json.dumps(
            {"message": "No valid email.", "retry": True})
        return func.HttpResponse(body=message,
                                 status_code=400)

    signup = {}

    for field, _ in form_fields:
        if field in data:
            signup[field] = data[field]

    signup["time"] = datetime.now(tz=TZ).isoformat()
    signup["id"] = uuid.uuid4().hex
    logging.info(f"{signup}")

    outputDocument.set(func.Document.from_dict(signup))

    logging.info(f"Successful submission for {data.get('name')}.")
    message = json.dumps({"message": "Kiitos ilmoittautumisestasi!"})
    return func.HttpResponse(body=message,
                             status_code=200)


@app.function_name(name="tatiseta")
@app.route(route="tatiseta", auth_level=func.AuthLevel.ANONYMOUS, methods=["GET"])
@app.cosmos_db_input(arg_name="documents",
                     database_name="main",
                     container_name="ruut-tatiseta",
                     sql_query="SELECT * FROM c ORDER BY c.time ASC",
                     connection="COSMOS_CONNECTION_STRING")
def tatiseta(req: func.HttpRequest, documents: func.DocumentList) -> func.HttpResponse:
    logging.info(f"Something {documents}")
    participants = []
    for doc in documents:
        participant = {"name": doc.get("name"), "yell": doc.get(
            "yell")}
        participants.append(participant)
    logging.info(f"result of {participants}")
    message = json.dumps(participants)
    return func.HttpResponse(body=message,
                             status_code=200)
