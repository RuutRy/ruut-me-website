import azure.functions as func
import logging
import pytz
import json
import re
from datetime import datetime, timedelta

app = func.FunctionApp(http_auth_level=func.AuthLevel.ANONYMOUS)
func.HttpResponse.mimetype = 'application/json'
func.HttpResponse.charset = 'utf-8'

TZ = pytz.timezone("Europe/Helsinki")
signup_start = TZ.localize(datetime(2024, 2, 15, 11))


@app.route(route="lagfestSignup")
def lagfestSignup(req: func.HttpRequest) -> func.HttpResponse:
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
        if now < signup_start + timedelta(hours=1):
            logging.info('Returned 400 for too early for non student')
            message = json.dumps(
                {"message": 'Voit ilmoittautua vasta tuntia myohemmin, jos sähkopostisi ei ole muotoa "@student.lut.fi" tai "@student.lab.fi".', "retry": True})
            return func.HttpResponse(body=message,
                                     status_code=400)

    signup = {}

    for field, _ in form_fields:
        if field in data:
            signup[field] = data[field]

    signup["time"] = datetime.now(tz=TZ)

    logging.info(f"Successful submission for {data.get('name')}.")
    message = json.dumps({"message": "Kiitos ilmoittautumisestasi!"})
    return func.HttpResponse(body=message,
                             status_code=400)
