FROM python:3.11-slim as builder
WORKDIR /AI/
# 시스템 패키지 설치 (필요한 경우)
RUN apt-get update && apt-get install -y \
    build-essential \
    ffmpeg \
    && rm -rf /var/lib/apt/lists/*
# requirements.txt만 먼저 복사하여 의존성 설치 캐시 활용
COPY requirements.txt .
# Ubuntu 계열에서 발생할 수 있는 pywin 관련 문제 제거
RUN sed -i '/pywin/d' requirements.txt
# pip 업그레이드 및 의존성 설치 (requirements.txt가 변경되지 않으면 캐시됨)
RUN pip install --upgrade pip && pip install -r requirements.txt

# 최종 이미지 – 의존성 설치 결과는 builder 단계에서 캐시됨
FROM python:3.11-slim
WORKDIR /AI/
# builder 단계에서 설치된 패키지를 그대로 복사
COPY --from=builder /usr/local/lib/python3.11/site-packages /usr/local/lib/python3.11/site-packages
# 나머지 소스 코드 복사
COPY . .
# PYTHONPATH 설정
ENV PYTHONPATH="/AI"
# 시스템 전역에 프로젝트 경로를 추가
RUN echo "/AI" > /usr/local/lib/python3.11/site-packages/app.pth
EXPOSE 8000
CMD ["python", "app/main.py"]
