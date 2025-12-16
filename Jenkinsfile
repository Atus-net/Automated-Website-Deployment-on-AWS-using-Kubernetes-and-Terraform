pipeline {
    agent any
    environment {
        DOCKER_IMAGE_BE = 'latuss/dolciluxe-backend'
        DOCKER_IMAGE_FE = 'latuss/dolciluxe-frontend'
        DOCKER_TAG = "${BUILD_NUMBER}"
    }
    stages {
        stage('Checkout') { steps { checkout scm } }
        
        stage('Build & Push Backend') {
            steps {
                script {
                    withCredentials([usernamePassword(credentialsId: 'docker-hub', passwordVariable: 'PASS', usernameVariable: 'USER')]) {
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
                    // Inject biến môi trường lúc Build React
                    sh "echo 'REACT_APP_API_URL=http://3.238.147.65' > ./frontend/.env"
                    
                    withCredentials([usernamePassword(credentialsId: 'docker-hub', passwordVariable: 'PASS', usernameVariable: 'USER')]) {
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