# project-root/backend/Dockerfile

# (1) Gradle 빌드나 Maven 빌드를 위해 OpenJDK 이용
FROM openjdk:17-slim as build
WORKDIR /app

# 소스 복사 (예: gradlew, build.gradle, src 등)
# 실제로는 필요에 따라 복사할 파일을 구체적으로 지정
COPY . .

# gradlew 권한 부여 (Optional)
RUN chmod +x gradlew

# Gradle 빌드 (실무에선 -x test 옵션 혹은 CI에서 테스트를 미리 실행)
RUN ./gradlew clean build -x test

# (2) 런타임 이미지
FROM openjdk:17-slim
WORKDIR /app
# 위에서 빌드된 JAR 파일 복사 (build/libs/*.jar 기준)
COPY --from=build /app/build/libs/*.jar app.jar

EXPOSE 8080
ENTRYPOINT ["java", "-jar", "/app/app.jar"]
