pipeline {
    agent any

    environment {
        DOCKERHUB_USER = "latuss"
        BACKEND_IMAGE  = "dolciluxe-backend"
        FRONTEND_IMAGE = "dolciluxe-frontend"
        IMAGE_TAG      = "${BUILD_NUMBER}"
    }

    stages {

        stage("Checkout Source Code") {
            steps {
                echo "📥 Checkout source code from GitHub"
                checkout scm
            }
        }

        stage("Build Docker Images") {
            steps {
                script {
                    echo "🐳 Build Backend Image"
                    sh """
                        docker build -t ${DOCKERHUB_USER}/${BACKEND_IMAGE}:${IMAGE_TAG} backend
                    """

                    echo "🐳 Build Frontend Image"
                    sh """
                        docker build -t ${DOCKERHUB_USER}/${FRONTEND_IMAGE}:${IMAGE_TAG} frontend
                    """
                }
            }
        }

        stage("Security Scan with Trivy") {
            steps {
                echo "🔍 Scan Docker images with Trivy"
                sh """
                    trivy image --severity HIGH,CRITICAL --exit-code 0 ${DOCKERHUB_USER}/${BACKEND_IMAGE}:${IMAGE_TAG}
                    trivy image --severity HIGH,CRITICAL --exit-code 0 ${DOCKERHUB_USER}/${FRONTEND_IMAGE}:${IMAGE_TAG}
                """
            }
        }

        stage("Push Images to DockerHub") {
            steps {
                withCredentials([usernamePassword(
                    credentialsId: 'dockerhub-creds',
                    usernameVariable: 'DOCKER_USER',
                    passwordVariable: 'DOCKER_PASS'
                )]) {
                    sh """
                        echo "$DOCKER_PASS" | docker login -u "$DOCKER_USER" --password-stdin
                        docker push ${DOCKERHUB_USER}/${BACKEND_IMAGE}:${IMAGE_TAG}
                        docker push ${DOCKERHUB_USER}/${FRONTEND_IMAGE}:${IMAGE_TAG}
                    """
                }
            }
        }

        stage("Deploy to K3s using Ansible") {
            steps {
                echo "🚀 Deploy application to K3s with Ansible"

                withCredentials([sshUserPrivateKey(
                    credentialsId: 'ansible-ssh-key',
                    keyFileVariable: 'SSH_KEY'
                )]) {
                    sh """
                        chmod 600 $SSH_KEY
                        export ANSIBLE_PRIVATE_KEY_FILE=$SSH_KEY

                        ansible-playbook ansible/site.yml \
                          --tags deploy \
                          -e "image_tag=${IMAGE_TAG}"
                    """
                }
            }
        }
    }

    post {
        success {
            echo "✅ CI/CD Pipeline completed successfully!"
        }
        failure {
            echo "❌ Pipeline failed. Please check logs."
        }
    }
}
