"""
picture Service
"""
import uuid
import time
import json
import requests
import config
import base64
import app.models.common as common
import app.models.response as response_dto
from fastapi import UploadFile

AI_IMG_2_IMG_ENDPOINT = config.AI_IMG_2_IMG_SERVER + "/make_image"  # 그림 AI 서버 주소
UPGRADE_HANDPICTURE_WEBHOOK = config.PUBLIC_HOST_URL + \
    "/submit/upgrade-handpicture"  # 그림 AI서버에서 돌려받을 주소
SPRING_UPGRADE_PICTURE_WEBHOOK = config.SPRING_SERVER_URL + \
    "/api/tale/submit/ai-picture"  # 그림 AI서버에서 받은 그림을 보내줄 주소

GEN_TALE_IMG_WEBHOOK = config.PUBLIC_HOST_URL + \
    "/submit/gen-tale-image"  # novita에서 받은 BaseTale 표지 이미지를 돌려받을 주소
SPRING_GEN_TALE_IMG_WEBHOOK = config.SPRING_SERVER_URL + \
    "/api/admin/tale/submit/ai-picture"  # novita에서 받은 BaseTale 표지 이미지를 보내줄 주소

GEN_TALE_INTRO_IMG_WEBHOOK = config.PUBLIC_HOST_URL + \
    "/submit/gen-tale-intro-image"  # novita에서 받은 BaseTale 소개 이미지를 돌려받을 주소
SPRING_GEN_TALE_INTRO_IMG_WEBHOOK = config.SPRING_SERVER_URL + \
    "/api/admin/tale/submit/ai-intro-picture"  # novita에서 받은 BaseTale 소개 이미지를 보내줄 주소


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
    그림 AI 서버가 정상적으로 동작하는지 확인하는 함수
    """
    try:
        response = requests.get(config.AI_IMG_2_IMG_SERVER + "/", timeout=1)
    except Exception:
        return False
    return response.status_code == 200


def upgrade_handpicture(roomId: int, order: int, prompt: str, negativePrompt: str, image: UploadFile):
    """
    그림 AI서버로 손그림 이미지를 전송하는 함수
    """
    fields = {
        'roomId': roomId,
        'order': order,
        'prompt': prompt,
        'negativePrompt': negativePrompt,
        'webhook': UPGRADE_HANDPICTURE_WEBHOOK
    }
    file = {
        'image': (image.filename, image.file.read(), 'image/png')
    }
    result = requests.post(AI_IMG_2_IMG_ENDPOINT, data=fields, files=file)

    return result.text


def upgrade_handpicture_submit(roomId: int, order: int, image: UploadFile):
    """
    그림 AI서버에서 업그레이드된 그림을 받고 spring으로 전송하는 함수
    """
    print("upgrade_handpicture_submit")
    file = {
        'file': (image.filename, image.file.read(), 'image/png')
    }
    fields = {
        'roomId': roomId,
        'order': order,
    }
    requests.post(SPRING_UPGRADE_PICTURE_WEBHOOK, data=fields, files=file)


def post_novita_api(prompts: common.PromptSet):
    """
    novita API에 이미지 생성 요청을 보내는 함수
    """
    url = "https://api.novita.ai/v3/async/txt2img"
    payload = {
        "event_type": "ASYNC_TASK_RESULT",
        "extra": {
            "response_image_type": "png",
            "webhook": {
                "url": GEN_TALE_IMG_WEBHOOK
            }
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
        }
    }
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {config.NOVITA_API_KEY}"
    }

    response = requests.request("POST", url, json=payload, headers=headers)
    print(response.json())
    task_id = response.json()['task_id']

    return task_id


# def get_novita_image(task_id):
#     url = 'https://api.novita.ai/v3/async/task-result'
#     params = {'task_id': task_id}
#     headers = {'Authorization': f'Bearer {config.NOVITA_API_KEY}'}

#     response = requests.get(url, headers=headers, params=params)

#     try:
#         pretty_json = json.dumps(
#             response.json(), indent=4, ensure_ascii=False)  # 보기 좋게 변환
#         print(pretty_json)  # 로그 출력
#     except json.JSONDecodeError:
#         print("Received Non-JSON Body:", pretty_json)  # JSON이 아니면 그냥 출력
#     return


def return_novita_image(web_hook_request, post_url):
    """
    novita에서 받은 이미지를 spring으로 전송하는 함수
    """
    image_url = web_hook_request["payload"]["images"][0]["image_url"]
    field = {
        'text': image_url
    }
    response = requests.post(post_url, data=field)
    return
