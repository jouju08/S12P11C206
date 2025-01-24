from dotenv import load_dotenv
import os
load_dotenv()

# PROJECT
BASE_URL = os.getenv("BASE_URL")
MAX_AUDIO_LENGTH = int(os.getenv("MAX_AUDIO_LENGTH"))

# Server
SPRING_SERVER = os.getenv("SPRING_SERVER")

# DB
MYSQL_USER = os.getenv("MYSQL_USER")
MYSQL_PASSWORD = os.getenv("MYSQL_PASSWORD")
MYSQL_HOST = os.getenv("MYSQL_HOST")
MYSQL_DBNAME = os.getenv("MYSQL_DBNAME")
MYSQL_PORT = os.getenv("MYSQL_PORT")

MYSQL_URL = f"mysql://{MYSQL_USER}:{MYSQL_PASSWORD}@{MYSQL_HOST}:{MYSQL_PORT}/{MYSQL_DBNAME}"

REDIS_HOST = str = os.getenv("REDIS_HOST")
REDIS_PORT = integer = os.getenv("REDIS_PORT")
REDIS_DATABASE = integer = os.getenv("REDIS_DATABASE")

# about aws s3
AWS_S3_BUCKET = os.getenv("AWS_S3_BUCKET")
AWS_S3_ACCESS = os.getenv("AWS_S3_ACCESS")
AWS_S3_SECRET = os.getenv("AWS_S3_SECRET")
AWS_S3_REGION = os.getenv("AWS_S3_REGION")
