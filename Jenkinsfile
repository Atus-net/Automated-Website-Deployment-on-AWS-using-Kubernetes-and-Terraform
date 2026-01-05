pipeline {
    agent any
    
    environment {
        DOCKER_HUB_USER = 'latuss'
        DOCKER_IMAGE_BE = "${DOCKER_HUB_USER}/dolciluxe-backend"
        DOCKER_IMAGE_FE = "${DOCKER_HUB_USER}/dolciluxe-frontend"
        DOCKER_TAG = "${BUILD_NUMBER}"
        
        // Cập nhật IP Master mới nhất từ Terraform tại đây
        MASTER_IP = "3.80.162.184" 
        SCANNER_HOME = tool 'SonarQubeScanner' 
    }
    
    stages {
        stage('Checkout') { 
            steps { 
                checkout scm 
            } 
        }
        
        stage('SonarQube Analysis') {
            steps {
                // 'sonar-server' phải khớp với tên trong Jenkins System Config
                withSonarQubeEnv('sonar-server') { 
                    sh """
                    ${SCANNER_HOME}/bin/sonar-scanner \
                    -Dsonar.projectKey=Dolciluxe-Project \
                    -Dsonar.sources=. \
                    -Dsonar.host.url=http://${MASTER_IP}:9000
                    """
                }
            }
        }

        stage('DevSecOps: Build, Scan & Push') {
            steps {
                script {
                    def services = ['backend', 'frontend']
                    
                    for (svc in services) {
                        // Kiểm tra thay đổi trong folder (Incremental logic)
                        def changed = sh(script: "git diff --name-only HEAD~1 HEAD | grep '^${svc}/' || true", returnStatus: true) == 0
                        
                        if (changed) {
                            echo "🚀 Phát hiện thay đổi tại: ${svc}"
                            
                            if (svc == 'frontend') {
                                // Tự động cập nhật IP API cho Frontend
                                sh "echo 'REACT_APP_API_URL=http://${MASTER_IP}' > ./frontend/.env"
                            }

                            withCredentials([
                                usernamePassword(credentialsId: 'docker-login', passwordVariable: 'PASS', usernameVariable: 'USER'),
                                file(credentialsId: 'ansible-vault-pass', variable: 'VAULT_PASS_FILE') // File chứa pass vault
                            ]) {
                                sh "docker login -u $USER -p $PASS"
                                
                                def imageName = (svc == 'backend') ? DOCKER_IMAGE_BE : DOCKER_IMAGE_FE
                                
                                // 1. Build
                                sh "docker build -t ${imageName}:${DOCKER_TAG} ./${svc}"
                                
                                // 2. Security Scan với Trivy
                                sh "trivy image --severity CRITICAL --exit-code 1 ${imageName}:${DOCKER_TAG}"
                                
                                // 3. Push
                                sh "docker push ${imageName}:${DOCKER_TAG}"
                                
                                // 4. Deploy qua Ansible với Vault Password
                                sh """
                                ansible-playbook -i ansible/inventory.ini ansible/site.yml \
                                --tags deploy \
                                --vault-password-file ${VAULT_PASS_FILE} \
                                -e 'target_service=${svc} image_tag=${DOCKER_TAG}'
                                """
                            }
                        }
                    }
                }
            }
        }
    }
    
    post {
        always {
            // Giải phóng bộ nhớ cho AWS Academy
            sh "docker system prune -f || true"
        }
    }
}