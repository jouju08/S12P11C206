"""
picture Service
"""
import uuid
import time
import json
import requests
import config
import app.models.request as request_dto
import app.models.response as response_dto
from fastapi import UploadFile


def handwrite_to_word(file):
    """
    손글씨 이미지를 텍스트로 변환하는 함수
    image -> text 변환
    """

    request_json = {
        'images': [
            {
                'format': 'jpg',
                'name': 'demo'
            }
        ],
        'requestId': str(uuid.uuid4()),
        'version': 'V2',
        'timestamp': int(round(time.time() * 1000))
    }
    payload = {'message': json.dumps(request_json).encode('UTF-8')}
    files = [
        ('file', file)
    ]
    headers = {
        'X-OCR-SECRET': config.NAVER_OCR_SECRET_KEY
    }
    response = requests.request(
        "POST", config.NAVER_OCR_INVOKE_URL, headers=headers, data=payload, files=files)
    response_json = json.load(response.text)
    result = ' '.join([item['inferText']
                      for item in response_json['images'][0]['fields']])

    return response_dto.TextResponseDto(text=result)


def is_image_suffix_ok(file: UploadFile):
    """
    이미지 파일의 확장자가 지원하는 확장자인지 확인하는 함수
    """
    file_suffix = file.filename.split(".")[-1]
    return file_suffix in ["jpg", "jpeg", "png", "pdf", "tif", "tiff"]


"""
todo
그림 ai 생성 api를 만들어야 함
"""
