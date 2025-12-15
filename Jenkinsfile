pipeline {
    agent any

    environment {
        // --- CẤU HÌNH THÔNG TIN DỰ ÁN ---
        AWS_REGION = 'us-east-1'
        
        // ID tài khoản AWS của bạn
        ECR_REGISTRY = '882816896880.dkr.ecr.us-east-1.amazonaws.com' 
        
        // --- TÊN REPO ECR (Cần khớp với tên bạn vừa tạo trên AWS) ---
        ECR_REPO_FRONTEND = 'dolciluxe-frontend'
        ECR_REPO_BACKEND = 'dolciluxe-backend'
        
        // Tag ảnh tự động tăng theo số lần Build
        IMAGE_TAG = "v${env.BUILD_NUMBER}" 

        // --- CẤU HÌNH KẾT NỐI ---
        // Địa chỉ IP của Server (Backend) để Frontend gọi API. 
        // Thay <IP_PUBLIC_EC2> bằng IP thật của máy chủ EC2 (Ví dụ: http://3.84.74.96:8000)
        // Nếu không điền đúng, Frontend sẽ không login được.
        BACKEND_API_URL = 'http://100.28.229.250:32412'
    }

    stages {
        // Giai đoạn 1: Lấy code từ GitHub
        stage('Checkout Code') {
            steps {
                checkout scm
            }
        }

        // Giai đoạn 2: Build Docker Images
        stage('Build Docker Images') {
            steps {
                script {
                    // --- 1. Build Backend (NodeJS) ---
                    echo '🏗️ Building Backend Image...'
                    // Lưu ý: Chỉ định build trong thư mục ./backend
                    sh "docker build --no-cache -t ${ECR_REGISTRY}/${ECR_REPO_BACKEND}:${IMAGE_TAG} ./backend"

                    // --- 2. Build Frontend (ReactJS) ---
                    echo '🏗️ Building Frontend Image...'
                    // Truyền biến API URL vào để Vite "đúc" cứng vào code
                    sh """
                    docker build --no-cache \
                    --build-arg VITE_BACKEND_URL=${BACKEND_API_URL} \
                    -t ${ECR_REGISTRY}/${ECR_REPO_FRONTEND}:${IMAGE_TAG} \
                    ./frontend
                    """
                }
            }
        }

        // Giai đoạn 3: Đẩy ảnh lên AWS ECR
        stage('Push to ECR') {
            steps {
                script {
                    echo '🔐 Logging into ECR...'
                    withCredentials([[$class: 'AmazonWebServicesCredentialsBinding', credentialsId: 'aws-credentials']]) {
                        // Đăng nhập vào ECR
                        sh "aws ecr get-login-password --region ${AWS_REGION} | docker login --username AWS --password-stdin ${ECR_REGISTRY}"
                        
                        echo '🚀 Pushing Backend...'
                        sh "docker push ${ECR_REGISTRY}/${ECR_REPO_BACKEND}:${IMAGE_TAG}"

                        echo '🚀 Pushing Frontend...'
                        sh "docker push ${ECR_REGISTRY}/${ECR_REPO_FRONTEND}:${IMAGE_TAG}"
                    }
                }
            }
        }

        // Giai đoạn 4: Deploy lên K3s
        stage('Deploy to K3s') {
            steps {
                script {
                    echo '🔄 Deploying to K3s Cluster...'
                    
                    // Sử dụng file config K3s đã có trên Jenkins Server
                    withEnv(['KUBECONFIG=/var/lib/jenkins/.kube/config']) {
                        
                        // --- Cập nhật Backend ---
                        // "deployment/dolciluxe-backend" là tên trong file k8s/deployment.yaml
                        // "dolciluxe-backend-container" là tên container trong file đó
                        sh "kubectl set image deployment/dolciluxe-backend dolciluxe-backend-container=${ECR_REGISTRY}/${ECR_REPO_BACKEND}:${IMAGE_TAG}"
                        
                        // --- Cập nhật Frontend ---
                        sh "kubectl set image deployment/dolciluxe-frontend dolciluxe-frontend-container=${ECR_REGISTRY}/${ECR_REPO_FRONTEND}:${IMAGE_TAG}"
                        
                        // Chờ quá trình cập nhật hoàn tất
                        sh "kubectl rollout status deployment/dolciluxe-backend"
                        sh "kubectl rollout status deployment/dolciluxe-frontend"
                    }
                }
            }
        }
    }

    post {
        success {
            echo '✅ Triển khai thành công! Cả Frontend và Backend đã được cập nhật.'
        }
        failure {
            echo '❌ Triển khai thất bại. Vui lòng kiểm tra Logs.'
        }
    }
}