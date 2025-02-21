# Stage 1: React 앱 빌드
FROM node:18-alpine as builder
WORKDIR /app
# 프로젝트 루트의 frontend 폴더에서 package*.json 파일을 복사
COPY frontend/package*.json ./
RUN npm install
# 전체 frontend 폴더 복사 (소스 코드)
COPY frontend ./
# React 앱 빌드 (빌드 산출물이 /app/dist 에 생성된다고 가정)
RUN npm run build

# Stage 2: nginx 이미지 생성
FROM nginx:alpine
# nginx 설정 파일 복사 (프로젝트 루트의 nginx 폴더 내 파일)
COPY nginx/nginx.conf /etc/nginx/nginx.conf
COPY nginx/mime.types /etc/nginx/mime.types
COPY nginx/conf.d/ /etc/nginx/conf.d/
# Stage 1에서 생성된 빌드 산출물을 nginx가 서빙할 디렉토리로 복사
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 2828 443
CMD ["nginx", "-g", "daemon off;"]
