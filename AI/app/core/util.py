import time


def save_file(file, save_mode: str, file_name: str):
    """
    파일을 저장한 후 저장된 파일의 경로를 반환하는 함수
    """
    file_path = f"./app/files/{time.time_ns()}_{file_name}"
    with open(f"./app/files/{time.time_ns()}_{file_name}", save_mode) as f:
        f.write(file)

    return file_path
