import azure.functions as func
import logging
import re
from datetime import datetime, timedelta
import pytz

TZ = pytz.timezone("Europe/Helsinki")
signup_start = TZ.localize(datetime(2024, 2, 15, 16))

app = func.FunctionApp()
func.HttpResponse.mimetype = 'application/json'
func.HttpResponse.charset = 'utf-8'


@app.function_name(name="LagFestSignUp")
@app.route(route="lagfest-signup")
def lagfest_signup(req: func.HttpRequest) -> func.HttpResponse:
    logging.info('Python HTTP trigger function processed a request.')
    now = datetime.now(tz=TZ)

    if now < signup_start:
        logging.info('Returned 400 for too early submission')
        return func.HttpResponse({"message": "Ilmoittautuminen ei ole vielä auki", "retry": True},
                                 status_code=400)

    data = req.get_json()
    if not data:
        logging.info('Returned 400 for no data')
        return func.HttpResponse({"message": "Et antanut mitään tietoja", "retry": False},
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

    if not data["gdpr"]:
        logging.info('Returned 400 for no gdpr agreement')
        return func.HttpResponse({"message": "Sinun tulee hyäksyä tietojen käsittely GDPRn mukaisesti, jotta voit ilmoittautua.", "retry": True},
                                 status_code=400)

    if not re.match(r"^.*@student.l(ut|ab).fi$", data["email"], flags=re.I):
        if now < signup_start + timedelta(hours=1):
            logging.info('Returned 400 for too early for non student')
            return func.HttpResponse({"message": 'Voit ilmoittautua vasta tuntia myöhemmin, jos sähköpostisi ei ole muotoa "@student.lut.fi" tai "@student.lab.fi".', "retry": True},
                                     status_code=400)

    signup = {}

    for field, _ in form_fields:
        if field in data:
            signup[field] = data[field]

    signup["time"] = datetime.now(tz=TZ)

    logging.info(f"Successful submission for {data.get('name')}.")
    return func.HttpResponse({"message": "Kiitos ilmoittautumisestasi!"},
                             status_code=400)
