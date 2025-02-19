
# 포팅메뉴얼
## 목차
- [0. 사용도구](#0-사용도구)
- [1. 개발환경](#1-개발환경)
  - [1.1 Frontend](#11-frontend)
  - [1.2 Backend](#12-backend)
  - [1.3 AI](#13-ai)
  - [1.4 Server](#14-server)
  - [1.5 Database](#15-database)
  - [1.6 UI/UX](#16-uiux)
  - [1.7 CI/CD 및 인증서 관리](#17-cicd-및-인증서-관리)
  - [1.8 IDE](#18-ide)
  - [1.9 형상 / 이슈관리](#19-형상--이슈관리)
  - [1.10 기타 툴](#110-기타-툴)
- [2. 환경변수](#2-환경변수)
  - [2.1 Docker-Compose](#21-docker-compose)
  - [2.2 Frontend](#22-frontend)
  - [2.3 Backend](#23-backend)
  - [2.4 AI](#24-ai)
  - [2.5 MySQL](#25-mysql)
- [3. EC2 세팅](#3-ec2-세팅)
  - [3.1 Docker 설치](#31-docker-설치)
  - [3.2 Docker Compose 및 설치](#32-docker-compose-및-설치)
  - [3.3 SSL 적용](#33-ssl-적용)
  - [3.4 OpenVidu 설치](#34-openvidu-설치)
- [4. 프로젝트 실행](#4-프로젝트-실행)



## 0. 사용도구
- 이슈 관리 : Notion, Jira
- 형상 관리 : GitLab
- 커뮤니케이션 : MatterMost, Discord
- 디자인 : Figma
- CI/CD : Jenkins, Docker


## 1. 개발환경
### 1.1 Frontend 
- **프레임워크**: React (18.3.1)
- **빌드 도구**: Vite (6.1.0)
- **Node.js버전**: Node.js 22.13.0
- **상태 관리**: zustand (5.0.3)
- **라우팅**: react-router-dom (7.1.1)
- **HTTP 클라이언트**: axios (1.7.9)
- **Lint & Formatting**: ESLint (9.18.0), Prettier (3.4.2)
- **CSS**:
    - 애니메이션: animate.css (4.1.1)
    - 아이콘: react-icons (5.4.0)
    - 스타일링: Tailwind CSS (3.4.17)


### 1.2 Backend
- **프레임워크**: Spring Boot (3.4.10)
- **데이터베이스 연동**:
    - Spring Data JPA
    - MySQL Connector (runtime)
- **캐시 및 메시징**: Spring Data Redis
- **보안**:
    - Spring Security
    - OAuth2 Client
    - JWT 토큰 처리 (io.jsonwebtoken: jjwt-api, jjwt-impl, jjwt-jackson)
- **웹**:
    - Spring Boot Starter Web (REST API)
    - Spring Boot Starter WebSocket (실시간 통신)
    - Spring Boot Starter WebFlux (비동기/리액티브 웹 클라이언트)
- **입력 검증**: Spring Boot Starter Validation
- **직렬화**: Jackson Databind
- **메일**: Spring Boot Starter Mail (이메일 인증)
- **애플리케이션 관리**: Spring Boot Actuator
- **추가 기능**:
    - AWS S3 연동: AWS SDK (S3, STS)
    - OpenVidu/LiveKit 연동: livekit-server
- **개발 보조 도구**:
    - Lombok (코드 간결화)


### 1.3 AI
- **프레임워크**: Fast API (0.115.6)
- **ASGI 서버**: Uvicorn (0.34.0)
- **주요 라이브러리**:
    - 데이터 유효성 검사 및 모델링: 
        - pydantic (2.10.5)
        - pydantic_core (2.27.2)
    - HTTP 클라이언트/서버: 
        - httpx (0.28.1)
        - starlette (0.41.3)
        - httptools (0.6.4)
        - h11 (0.14.0)
    - 비동기 지원: 
        - anyio (4.8.0)
        - nest-asyncio (1.6.0)
        - websockets (14.1)
    - 환경 변수 관리: python-dotenv (1.0.1)
    - 요청/응답 유틸: 
        - python-multipart (0.0.20)
        - orjson (3.10.14)
    - 디버깅 및 개발 도구: 
        - debugpy (1.8.12)
        - jupyter_client (8.6.3)
        - ipykernel (6.29.5)
        - ipython (8.31.0)
    - 기타 유틸리티: 
        - annotated-types (0.7.0)
        - asttokens (3.0.0)
        - certifi (2024.12.14)
        - charset-normalizer (3.4.1)
        - click (8.1.8)
        - colorama (0.4.6)
        - decorator (5.1.1)
        - distro (1.9.0)
        - executing (2.1.0)
        - jsonpatch (1.33)
        - jsonpointer (3.0.0)
        - langchain-core (0.3.29)
        - langchain-openai (0.3.0)
        - langsmith (0.2.10)
        - matplotlib-inline (0.1.7)
        - novita_client (0.7.1)
        - openai (1.59.7)
        - packaging (24.2)
        - parso (0.8.4)
        - pillow (11.1.0)
        - platformdirs (4.3.6)
        - prompt_toolkit (3.0.48)
        - psutil (6.1.1)
        - pure_eval (0.2.3)
        - Pygments (2.19.1)
        - python-dateutil (2.9.0.post0)
        - PyYAML (6.0.2)
        - pyzmq (26.2.0)
        - regex (2024.11.6)
        - requests (2.32.3)
        - requests-toolbelt (1.0.0)
        - six (1.17.0)
        - sniffio (1.3.1)
        - stack-data (0.6.3)
        - tenacity (9.0.0)
        - tiktoken (0.8.0)
        - tornado (6.4.2)
        - tqdm (4.67.1)
        - traitlets (5.14.3)
        - typing_extensions (4.12.2)
        - urllib3 (2.3.0)
        - watchfiles (1.0.4)
        - wcwidth (0.2.13)



### 1.4 Server
- Ubuntu 22.04.5 LTS
- Nginx
- Docker
- Docker Compose
- OpenVidu 3.0
- Redis 6.2.6


### 1.5 Database
- MySQL 8.0.35


### 1.6 UI/UX
- Figma

### 1.7 CI/CD 및 인증서 관리
- **CI/CD**: Jenkins
- **SSL 인증서**: certbot, Let`s Encrypt


### 1.8 IDE
- Visual Studio Code 1.97.2
- IntelliJ IDEA 2023.3.8


### 1.9 형상 / 이슈관리
- GitLab
- Jira


### 1.10 기타 툴
- Postman 

## 환경변수
### 2.1 Docker-Compose
``` 
FRONT_PORT=${FRONT_PORT}
SPRING_PORT=${SPRING_PORT}
AI_PORT=${AI_PORT}
REDIS_PORT=${REDIS_PORT}
MYSQL_PORT=${MYSQL_PORT}$
```

### 2.2 Frontend
```
VITE_APP_VERSION =${VITE_APP_VERSION}
VITE_WS_URL_LOCAL = ${VITE_WS_URL_LOCAL} # 로컬용 웹소켓 주소
VITE_WS_URL_DEPLOY = ${VITE_WS_URL_DEPLOY} # 배포용 웹소켓 주소

VITE_OPENVIDU_URL = ${VITE_OPENVIDU_URL} # OPENVIUD 주소
VITE_KAKAO_CLIENT_ID=${VITE_KAKAO_CLIENT_ID}
VITE_REDIRECT_URI=${VITE_REDIRECT_URI}
VITE_BACKEND_URL=${VITE_BACKEND_URL}
```

### 2.3 Backend
```
SPRING_DB_URL=${SPRING_DB_URL}
SPRING_DB_USERNAME=${SPRING_DB_USERNAME}
SPRING_DB_PASSWORD=${SPRING_DB_PASSWORD}

SPRING_PORT=${SPRING_PORT}
FRONT_PORT=${FRONT_PORT}$

REDIS_HOST=${REDIS_HOST}$
REDIS_PORT=${REDIS_PORT}$
REDIS_EXPIRE_TIME=${REDIS_EXPIRE_TIME}

# about aws s3
AWS_S3_BUCKET=${AWS_S3_BUCKET}
AWS_S3_ACCESS=${AWS_S3_ACCESS}
AWS_S3_SECRET=${AWS_S3_SECRET}
AWS_S3_REGION=${AWS_S3_REGION}

# SMTP
SPRING_MAIL_HOST=${SPRING_MAIL_HOST}
SPRING_MAIL_USERNAME=${SPRING_MAIL_USERNAME}
SPRING_MAIL_PASSWORD=${SPRING_MAIL_PASSWORD}
SPRING_MAIL_PORT=${SPRING_MAIL_PORT}

# jwt
JWT_SECRET=${JWT_SECRET}
JWT_ACCESSEXPIRATION=${JWT_ACCESSEXPIRATION}
JWT_REFRESHEXPIRATION=${JWT_REFRESHEXPIRATION}

# kakao login
OAUTH_KAKAO_CLIENT_ID=${OAUTH_KAKAO_CLIENT_ID}
OAUTH_KAKAO_SECRET=${OAUTH_KAKAO_SECRET}
OAUTH_KAKAO_REDIRECT_URI=${OAUTH_KAKAO_REDIRECT_URI}

# ai
AI_SERVER_URL=${AI_SERVER_URL}

server.ssl.enabled: false

# LiveKit configuration
LIVEKIT_API_KEY=${LIVEKIT_API_KEY}
LIVEKIT_API_SECRET=${LIVEKIT_API_SECRET}

OPENVIDU_URL=${OPENVIDU_URL}
OPENVIDU_SECRET=${OPENVIDU_SECRET}

```

### 2.4 AI
```
# api keys
OPENAI_API_KEY=${OPENAI_API_KEY}
NOVITA_API_KEY=${NOVITA_API_KEY}
NAVER_OCR_SECRET_KEY = ${NAVER_OCR_SECRET_KEY}
NAVER_OCR_INVOKE_URL = ${NAVER_OCR_INVOKE_URL}

LANGCHAIN_TRACING_V2=${LANGCHAIN_TRACING_V2}
LANGCHAIN_ENDPOINT=${LANGCHAIN_ENDPOINT}
LANGCHAIN_API_KEY=${LANGCHAIN_API_KEY}
LANGCHAIN_PROJECT=${LANGCHAIN_PROJECT}

# project setting
FAST_API_HOST=${FAST_API_HOST}
FAST_API_PORT=${FAST_API_PORT}
API_BASE_URL=${API_BASE_URL}
MAX_AUDIO_LENGTH=${MAX_AUDIO_LENGTH}

# server
PUBLIC_HOST_URL=${PUBLIC_HOST_URL}
SPRING_SERVER_URL=${SPRING_SERVER_URL}
AI_IMG_2_IMG_SERVER=${AI_IMG_2_IMG_SERVER}
```

### 2.5 MySQL
```
MYSQL_ROOT_PASSWORD=${MYSQL_ROOT_PASSWORD}
MYSQL_DATABASE=${MYSQL_DATABASE}                 
MYSQL_USER=${MYSQL_USER}                        
MYSQL_PASSWORD=${MYSQL_PASSWORD}   
```


## 3. EC2 세팅
### 3.1 Docker 설치
- Ubuntu Docker 설치 순서
    
    ### 1. 우분투 시스템 패키지 업데이트
    
    ```
    sudo apt-get update
    ```
    
    ### 2. 필요한 패키지 설치
    
    ```
    sudo apt-get install apt-transport-https ca-certificates curl gnupg-agent software-properties-common
    ```
    
    ### 3. Docker의 공식 GPG키를 추가
    
    ```
    curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/trusted.gpg.d/docker.gpg
    ```
    
    ### 4. Docker의 공식 apt 저장소를 추가
    
    ```
    sudo add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable"
    ```
    
    ### 5.  시스템 패키지 업데이트
    
    ```jsx
    sudo apt-get update
    ```
    
    ### 6. Docker 설치
    
    ```
    sudo apt-get install docker-ce docker-ce-cli containerd.io
    ```
    
    ### 7. Docker가 설치 확인
    
    **7-1. 도커 실행상태 확인**
    
    ```
    sudo systemctl status docker
    ```
    
    **7-2. 도커 실행**
    
    ```
    sudo docker run hello-world
    ```

### 3.2 Docker Compose 및 설치
- Ubuntu Docker Compose 설치 순서

    ```
    sudo curl -L "https://github.com/docker/compose/releases/download/v2.32.4/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    ```

    - 도커 컴포즈 최신 버전은 https://github.com/docker/compose/releases

    ### 2. 도커 컴포즈 실행 권한 부여

    ```
    sudo chmod +x /usr/local/bin/docker-compose
    ```

    ### 3. 도커 컴포즈 설치 확인

    ```
    docker-compose --version
    ```


### 3.3 SSL 적용
- SSL 적용 순서서

    `### 기본 인증서 다운

    ```
    sudo certbot certonly --standalone -d [도메인]
    ```

    ### 키 생성 확인

    ```
    sudo ls -la /etc/letsencrypt/live/[도메인]
    ```

    ### options-ssl-nginx.conf와 ssl-dhparams.pem 파일 생성

    1. options-ssl-nginx.conf 생성

    ```
    sudo mkdir -p /etc/letsencrypt
    sudo wget https://raw.githubusercontent.com/certbot/certbot/master/certbot-nginx/certbot_nginx/_internal/tls_configs/options-ssl-nginx.conf -O /etc/letsencrypt/options-ssl-nginx.conf
    ```

    1. ssl-dhparams.pem 생성

    ```
    sudo openssl dhparam -out /etc/letsencrypt/ssl-dhparams.pem 2048
    ```

    ### Nginx 컨테이너 재시작

    ```
    sudo docker restart nginx
    ```

    ## 선택사항

    ### Certbot 자동 갱신 후 Nginx 재로드

    ```
    sudo crontab -e
    0 3 * * * certbot renew --quiet && docker-compose -f /home/ubuntu/tinker/docker-compose.yml restart nginx
    ```

    - 크론식으로 매일 오전 3시에 Certbot 갱신을 시도하고 성공하면 Nginx 컨테이너 재시작하여 새로운 인증서 적용`



### 3.4 OpenVidu 설치
- 설치 순서
    ### OpenVidu 설치
    ```
    sh <(curl -fsSL http://get.openvidu.io/community/singlenode/latest/install.sh)
    ```

    ### Let`s Encrypt 인증서 인 경우
    ```
    sh <(curl -fsSL http://get.openvidu.io/community/singlenode/latest/install.sh) \
    --no-tty --install \
    --domain-name='openvidu.example.io' \
    --enabled-modules='observability,app' \
    --turn-domain-name='turn.example.io' \
    --livekit-api-key='xxxxx' \
    --livekit-api-secret='xxxxx' \
    --dashboard-admin-user='xxxxx' \
    --dashboard-admin-password='xxxxx' \
    --redis-password='xxxxx' \
    --minio-access-key='xxxxx' \
    --minio-secret-key='xxxxx' \
    --mongo-admin-user='xxxxx' \
    --mongo-admin-password='xxxxx' \
    --mongo-replica-set-key='xxxxx' \
    --grafana-admin-user='xxxxx' \
    --grafana-admin-password='xxxxx' \
    --default-app-user='xxxxx' \
    --default-app-password='xxxxx' \
    --default-app-admin-user='xxxxx' \
    --default-app-admin-password='xxxxx' \
    --certificate-type='letsencrypt' \
    --letsencrypt-email='example@example.io'
    ```

    ### OpenVidu 실행
    ```
    systemctl start openvidu
    ```

## 4. 프로젝트 실행
### Docker compose 실행
```
docker compose up
```
