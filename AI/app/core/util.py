import time
import os
import json
from fastapi import Request


def save_file(file, save_mode: str, file_name: str):
    """
    파일을 저장한 후 저장된 파일의 경로를 반환하는 함수
    """
    file_path = f"./app/files/{time.time_ns()}_{file_name}"
    with open(f"./app/files/{time.time_ns()}_{file_name}", save_mode) as f:
        f.write(file)

    return file_path


def delete_file(file_path: str):
    """
    파일을 삭제하는 함수
    """
    os.remove(file_path)


def pprint_request(request):
    body_str = request.decode("utf-8")  # 문자열 변환

    try:
        parsed_json = json.loads(body_str)  # JSON 변환
        pretty_json = json.dumps(
            parsed_json, indent=4, ensure_ascii=False)  # 보기 좋게 변환
        print(pretty_json)  # 로그 출력
    except json.JSONDecodeError:
        print("Received Non-JSON Body:", body_str)  # JSON이 아니면 그냥 출력


def parse_request(request):
    """
    Request를 파싱하는 함수
    """
    body_str = request.decode("utf-8")  # 문자열 변환
    try:
        parsed_json = json.loads(body_str)  # JSON 변환
        return parsed_json
    except json.JSONDecodeError:
        print("Received Non-JSON Body:", body_str)  # JSON이 아니면 그냥 출력
        return body_str
