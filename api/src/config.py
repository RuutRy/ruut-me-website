import os

DATA_DIR = os.getenv('DATA_DIR', '..')
MONGO_URL = os.getenv('MONGO_URL', 'mongodb://localhost:27017/ruut')
PORT = os.getenv('PORT', '5000')

SMTP_HOST = os.getenv('SMTP_HOST')
SMTP_PORT = os.getenv('SMTP_PORT')
SMTP_USER = os.getenv('SMTP_USER')
SMTP_PASSWORD = os.getenv('SMTP_PASSWORD')
