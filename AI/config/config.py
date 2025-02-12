"""
환경변수, 공통변수를 관리하는 파일
"""

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
NOVITA_API_KEY = os.getenv('NOVITA_API_KEY')

# Architecture
SPRING_SERVER_URL = os.getenv("SPRING_SERVER_URL")
AI_IMG_2_IMG_SERVER = os.getenv("AI_IMG_2_IMG_SERVER")
PUBLIC_HOST_URL = f"{os.getenv('PUBLIC_HOST_URL')}:{os.getenv('FAST_API_PORT')}{os.getenv('API_BASE_URL')}"

AI_IMG_2_IMG_ENDPOINT = AI_IMG_2_IMG_SERVER + "/make_image"  # 그림 AI 서버 주소
# 현재 서버 주소

UPGRADE_HANDPICTURE_WEBHOOK = PUBLIC_HOST_URL + \
    "/submit/upgrade-handpicture"  # 그림 AI서버에서 돌려받을 주소
SPRING_UPGRADE_PICTURE_WEBHOOK = SPRING_SERVER_URL + \
    "/api/tale/submit/ai-picture"  # 그림 AI서버에서 받은 그림을 보내줄 주소

GEN_TALE_IMG_WEBHOOK = PUBLIC_HOST_URL + \
    "/submit/gen-tale-image"  # novita에서 받은 BaseTale 표지 이미지를 돌려받을 주소
SPRING_GEN_TALE_IMG_WEBHOOK = SPRING_SERVER_URL + \
    "/api/admin/tale/submit/ai-picture"  # novita에서 받은 BaseTale 표지 이미지를 보내줄 주소

GEN_TALE_INTRO_IMG_WEBHOOK = PUBLIC_HOST_URL + \
    "/submit/gen-tale-intro-image"  # novita에서 받은 BaseTale 소개 이미지를 돌려받을 주소
SPRING_GEN_TALE_INTRO_IMG_WEBHOOK = SPRING_SERVER_URL + \
    "/api/admin/tale/submit/ai-intro-picture"  # novita에서 받은 BaseTale 소개 이미지를 보내줄 주소
