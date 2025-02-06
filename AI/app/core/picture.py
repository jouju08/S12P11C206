"""
picture Service
"""
import uuid
import time
import json
import requests
import config
import config
import app.models.common as common
import app.models.response as response_dto
from fastapi import UploadFile

AI_IMG_2_IMG_ENDPOINT = config.AI_IMG_2_IMG_SERVER + "/make_image"
SPRING_SERVER_URL_ENDPOINT = config.SPRING_SERVER_URL + \
    "/api/tale/submit/ai-picture"


def handwrite_to_word(file):
    """
    손글씨 이미지를 텍스트로 변환하는 함수
    image -> text 변환
    """

    request_json = {
        'images': [
            {
                'format': 'png',
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

    response_json = response.json()

    result = ' '.join([item['inferText']
                      for item in response_json['images'][0]['fields']])

    if response_json['images'][0]['fields'] == []:
        return None

    return response_dto.TextResponseDto(text=result)


def is_image_suffix_ok(file: UploadFile):
    """
    이미지 파일의 확장자가 지원하는 확장자인지 확인하는 함수
    """
    file_suffix = file.filename.split(".")[-1]
    return file_suffix in ["jpg", "jpeg", "png", "pdf", "tif", "tiff"]


def can_draw_picture():
    """
    그림을 그릴 수 있는지 확인하는 함수
    """
    try:
        response = requests.get(config.AI_IMG_2_IMG_SERVER + "/", timeout=1)
    except Exception:
        return False
    return response.status_code == 200


def generate_img2img(roomId: int, order: int, prompt: str, negativePrompt: str, image: UploadFile):
    """
    "http://localhost:7582"로 POST 요청을 보내고,
    응답의 텍스트를 반환하는 함수.
    """
    fields = {
        'roomId': roomId,
        'order': order,
        'prompt': prompt,
        'negativePrompt': negativePrompt
    }
    file = {
        'image': (image.filename, image.file.read(), 'image/png')
    }
    result = requests.post(AI_IMG_2_IMG_ENDPOINT, data=fields, files=file)

    return result.text


def submit_picture(roomId: int, order: int, image: UploadFile):
    print("submit_picture")
    file = {
        'file': (image.filename, image.file.read(), 'image/png')
    }
    fields = {
        'roomId': roomId,
        'order': order,
    }
    result = requests.post(config.SPRING_SERVER_URL +
                           "/api/tale/submitt/ai-picture", data=fields, files=file)
    return


def post_novita_api(img_base_64, prompts: common.PromptSet):
    url = "https://api.novita.ai/v3/async/img2img"
    payload = {
        "extra": {
            "response_image_type": "png"
        },
        "request": {
            "model_name": "sd_xl_base_1.0.safetensors",
            "prompt": prompts.prompt,
            "negative_prompt": prompts.negativePrompt,
            "height": 512,
            "width": 512,
            "image_num": 1,
            "steps": 20,
            "seed": -1,
            "clip_skip": 1,
            "guidance_scale": 7.5,
            "sampler_name": "Euler a",
            "embeddings": [
            ],
            "loras": [
            ],
            "image_base64": img_base_64
        }
    }
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {config.NOVITA_API_KEY}"
    }

    response = requests.request("POST", url, json=payload, headers=headers)
    task_id = response.json()['task_id']

    return task_id


def get_novita_image(task_id):
    url = 'https://api.novita.ai/v3/async/task-result'
    params = {'task_id': task_id}
    headers = {'Authorization': f'Bearer {config.NOVITA_API_KEY}'}

    response = requests.get(url, headers=headers, params=params)
    return response.json()['images'][0]['image_url']
