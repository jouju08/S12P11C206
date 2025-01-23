from dotenv import load_dotenv
import os
load_dotenv()

BASE_URL = os.getenv("BASE_URL")
MAX_AUDIO_LENGTH = os.getenv("MAX_AUDIO_LENGTH")
