# 베이스 이미지 설정 (Python 3.11 이상)
FROM python:3.11-slim

# 작업 디렉토리 설정
WORKDIR /AI/

# 필요한 시스템 패키지 설치
RUN apt-get update && apt-get install -y \
    build-essential \
    ffmpeg \
    && rm -rf /var/lib/apt/lists/*

# 의존성 파일을 복사
COPY requirements.txt .

# pywin 관련 패키지 제거 (Ubuntu 계열에서 에러 방지)
RUN sed -i '/pywin/d' requirements.txt

# 의존성 설치 (전역에 설치)
RUN pip install --upgrade pip && pip install -r requirements.txt

# 소스 코드 복사
COPY . .

# PYTHONPATH 설정
ENV PYTHONPATH="/AI"

# 가상환경에서 app.pth 파일처럼, 전역 환경에서도 프로젝트 경로를 추가
RUN echo "/AI" > /usr/local/lib/python3.11/site-packages/app.pth

# 필요한 포트 노출 (예: 8000번 포트)
EXPOSE 8000

# 애플리케이션 실행 (Uvicorn 사용)
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
