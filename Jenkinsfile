pipeline {
    agent any

    environment {
        // 도커 이미지 태그 (실무에선 빌드 번호, Git SHA, 버전 문자열 등을 사용)
        DOCKER_IMAGE_TAG = "1.1.0"

        // Docker Registry
        DOCKER_REGISTRY = "myregistry.com"
        DOCKER_CREDENTIALS_ID = "docker-hub-credentials"

        BACKEND_IMAGE_NAME = "myapp-backend"
        FRONTEND_IMAGE_NAME = "myapp-frontend"
    }

    stages {
        stage('Checkout') {
            steps {
                git branch: 'deploy', url: 'https://lab.ssafy.com/s12-webmobile1-sub1/S12P11C206.git'
            }
        }

        stage('Build Code') {
            steps {
                // Backend build
                dir("backend") {
                    sh "./gradlew clean build -x test"
                }
                // Frontend build
                dir("frontend") {
                    sh "npm install"
                    sh "npm run build"
                }
            }
        }

        stage('Docker Build & Push') {
            steps {
                script {
                    // 도커 레지스트리 로그인
                    withCredentials([usernamePassword(credentialsId: "${DOCKER_CREDENTIALS_ID}",
                                                       passwordVariable: 'DOCKER_PASS',
                                                       usernameVariable: 'DOCKER_USER')]) {
                        sh "docker login -u $DOCKER_USER -p $DOCKER_PASS ${DOCKER_REGISTRY}"
                    }

                    // Backend 이미지 빌드 & 푸시
                    sh """
                    cd backend
                    docker build -t ${DOCKER_REGISTRY}/${BACKEND_IMAGE_NAME}:${DOCKER_IMAGE_TAG} .
                    docker push ${DOCKER_REGISTRY}/${BACKEND_IMAGE_NAME}:${DOCKER_IMAGE_TAG}
                    """

                    // Frontend 이미지 빌드 & 푸시
                    sh """
                    cd ../frontend
                    docker build -t ${DOCKER_REGISTRY}/${FRONTEND_IMAGE_NAME}:${DOCKER_IMAGE_TAG} .
                    docker push ${DOCKER_REGISTRY}/${FRONTEND_IMAGE_NAME}:${DOCKER_IMAGE_TAG}
                    """
                }
            }
        }

        stage('Deploy GREEN') {
            steps {
                script {
                    // 새 버전(GREEN) override 파일 생성 (이미지 태그 지정)
                    sh """
                    cat <<EOF > docker-compose.green.override.yml
                    version: "3.8"
                    services:
                      backend-green:
                        image: ${DOCKER_REGISTRY}/${BACKEND_IMAGE_NAME}:${DOCKER_IMAGE_TAG}
                      frontend-green:
                        image: ${DOCKER_REGISTRY}/${FRONTEND_IMAGE_NAME}:${DOCKER_IMAGE_TAG}
                    EOF
                    """

                    // Green 스택 실행
                    sh "docker-compose -f docker-compose.green.yml -f docker-compose.green.override.yml up -d"

                    // 간단한 헬스체크 (예: backend-green:8080)
                    // 실제 주소/엔드포인트 맞게 수정 필요
                    sh """
                    for i in {1..10}; do
                      if docker exec backend-green curl -f http://localhost:8080/actuator/health; then
                        echo "GREEN is healthy!"
                        break
                      else
                        echo "Waiting for GREEN to be healthy..."
                        sleep 5
                      fi
                    done
                    """
                }
            }
        }

        stage('Switch Nginx to GREEN') {
            steps {
                script {
                    // nginx.conf를 교체 -> nginx-green.conf를 default.conf로 복사
                    sh """
                    docker cp nginx/conf/nginx-green.conf nginx:/etc/nginx/conf.d/default.conf
                    docker exec nginx nginx -s reload
                    """
                }
            }
        }

        stage('Shutdown BLUE') {
            steps {
                script {
                    // 기존 Blue 스택 종료
                    sh "docker-compose -f docker-compose.blue.yml down"
                }
            }
        }
    }

    post {
        always {
            // 임시파일 정리
            sh "rm -f docker-compose.green.override.yml || true"
        }
    }
}
