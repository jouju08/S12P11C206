# project-root/frontend/Dockerfile

# (1) 빌드 스테이지 (Node)
FROM node:18-alpine as build
WORKDIR /app

# package*.json 복사 후 의존성 설치
COPY package*.json ./
RUN npm install

# 나머지 소스 복사
COPY . .

# Vite 등으로 빌드 (dist 폴더 생성)
RUN npm run build

# (2) 런타임 스테이지 (Nginx)
FROM nginx:alpine
# 빌드 산출물(dist)을 Nginx 기본 경로로 복사
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
