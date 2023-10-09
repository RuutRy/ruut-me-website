FROM python:alpine
MAINTAINER Juho

ADD requirements.txt .
RUN pip install -r requirements.txt

WORKDIR /app
COPY src/ /app/

CMD ["python", "-u", "./main.py"]
