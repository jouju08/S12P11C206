"""
picture Service
"""
import uuid
import time
import json
import requests
import httpx
import config
from requests_toolbelt import MultipartEncoder
import config
import app.core.llm as llm_service
import app.models.common as common
import app.models.request as request_dto
import app.models.response as response_dto
from fastapi import UploadFile

AI_IMG_2_IMG_ENDPOINT = config.AI_IMG_2_IMG_SERVER + "/make_image"


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


def generate_img2img(pictureRequestDto: request_dto.GeneratePictureRequestDto):
    """
    "http://localhost:7582"로 POST 요청을 보내고,
    응답의 텍스트를 반환하는 함수.
    """
    """async with httpx.AsyncClient() as client:
        response = await client.post(AI_IMG_2_IMG_ENDPOINT, json=pictureRequestDto.model_dump_json())
        response.raise_for_status()  # 에러 발생 시 예외 발생
        return response.text  # 또는 response.json() 등 필요한 처리"""
    request = MultipartEncoder(fields={
        'roomId': str(pictureRequestDto.roomId),
        'order': str(pictureRequestDto.order),
        'prompt': pictureRequestDto.promptSet.prompt,
        'negativePrompt': pictureRequestDto.promptSet.negativePrompt,
        'image': pictureRequestDto.image
    })
    headers = {'Content-Type': request.content_type}
    result = requests.post(AI_IMG_2_IMG_ENDPOINT,
                           data=request, headers=headers)
    print(result.text)
    return result.text


"""    
    img_base_64 = base64.b64encode(img).decode('utf-8')


    task_id = post_novita_api(img_base_64, pictureRequestDto.promptSet)
    image_url = get_novita_image(task_id)
    return response_dto.URLResponseDto(url=image_url)"""


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
