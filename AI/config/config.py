from dotenv import load_dotenv
import os
load_dotenv()

# PROJECT
BASE_URL = os.getenv("BASE_URL")
MAX_AUDIO_LENGTH = int(os.getenv("MAX_AUDIO_LENGTH"))

# DB
MYSQL_USER = os.getenv("MYSQL_USER")
MYSQL_PASSWORD = os.getenv("MYSQL_PASSWORD")
MYSQL_HOST = os.getenv("MYSQL_HOST")
MYSQL_DBNAME = os.getenv("MYSQL_DBNAME")
MYSQL_PORT = os.getenv("MYSQL_PORT")

MYSQL_URL = f"mysql://{MYSQL_USER}:{MYSQL_PASSWORD}@{MYSQL_HOST}:{MYSQL_PORT}/{MYSQL_DBNAME}"

REDIS_URL = os.getenv("REDIS_URL")
