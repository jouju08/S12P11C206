from dotenv import load_dotenv
import os
load_dotenv()

# PROJECT
FAST_API_HOST = os.getenv("FAST_API_HOST")
FAST_API_PORT = int(os.getenv("FAST_API_PORT"))
API_BASE_URL = os.getenv("API_BASE_URL")
MAX_AUDIO_LENGTH = int(os.getenv("MAX_AUDIO_LENGTH"))

# API KEY
NAVER_OCR_SECRET_KEY = os.getenv('NAVER_OCR_SECRET_KEY')
NAVER_OCR_INVOKE_URL = os.getenv('NAVER_OCR_INVOKE_URL')

# Architecture
SPRING_SERVER_URL = os.getenv("SPRING_SERVER_URL")
