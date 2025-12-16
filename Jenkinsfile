pipeline {
    agent any
    
    environment {
        // ⚠️ THAY "latuss" BẰNG TÊN DOCKER HUB CỦA BẠN NẾU KHÁC
        DOCKER_IMAGE_BE = 'latuss/dolciluxe-backend'
        DOCKER_IMAGE_FE = 'latuss/dolciluxe-frontend'
        DOCKER_TAG = "${BUILD_NUMBER}"
        
        // Cấu hình SonarQube (Khớp với tên bạn đặt trong Manage Jenkins)
        SCANNER_HOME = tool 'SonarQubeScanner' 
    }
    
    stages {
        stage('Checkout') { steps { checkout scm } }
        
        // Thêm đoạn này để chạy SonarQube Demo
        stage('SonarQube Analysis') {
            steps {
                withSonarQubeEnv('sonar-server') { 
                    sh """
                    ${SCANNER_HOME}/bin/sonar-scanner \
                    -Dsonar.projectKey=Dolciluxe-Project \
                    -Dsonar.sources=. \
                    -Dsonar.host.url=http://44.197.215.209:9000 \
                    -Dsonar.login=sonar-token 
                    """
                }
            }
        }

        stage('Build & Push Backend') {
            steps {
                script {
                    // Sửa ID thành 'docker-login'
                    withCredentials([usernamePassword(credentialsId: 'docker-login', passwordVariable: 'PASS', usernameVariable: 'USER')]) {
                        sh "docker login -u $USER -p $PASS"
                        sh "docker build -t ${DOCKER_IMAGE_BE}:${DOCKER_TAG} ./backend"
                        sh "docker push ${DOCKER_IMAGE_BE}:${DOCKER_TAG}"
                    }
                }
            }
        }
        
        stage('Build & Push Frontend') {
            steps {
                script {
                    // 👇 Đã điền sẵn IP K3s của bạn
                    sh "echo 'REACT_APP_API_URL=http://3.80.162.184' > ./frontend/.env"
                    
                    withCredentials([usernamePassword(credentialsId: 'docker-login', passwordVariable: 'PASS', usernameVariable: 'USER')]) {
                        sh "docker build -t ${DOCKER_IMAGE_FE}:${DOCKER_TAG} ./frontend"
                        sh "docker push ${DOCKER_IMAGE_FE}:${DOCKER_TAG}"
                    }
                }
            }
        }

        stage('Deploy to K3s') {
            steps {
                // Thay thế Image mới vào file YAML
                sh "sed -i 's|image: .*dolciluxe-backend:.*|image: ${DOCKER_IMAGE_BE}:${DOCKER_TAG}|' k3s/backend-deploy.yaml"
                sh "sed -i 's|image: .*dolciluxe-frontend:.*|image: ${DOCKER_IMAGE_FE}:${DOCKER_TAG}|' k3s/frontend-deploy.yaml"
                
                // Deploy
                sh "kubectl apply -f k3s/"
            }
        }
    }
}