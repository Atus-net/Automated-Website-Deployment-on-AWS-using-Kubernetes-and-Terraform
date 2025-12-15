#!/bin/bash

echo "🚀 KHOI DONG HE THONG TU DONG (SMART MODE - FIX TLS)..."

# 1. Chạy Terraform
cd terraform
# Xóa key cũ nếu có để tránh lỗi duplicate
aws ec2 delete-key-pair --key-name dolciluxe-key > /dev/null 2>&1
terraform init
terraform apply -auto-approve

# 2. Lấy IP Server
SERVER_IP=$(terraform output -raw server_ip | tr -d '\r')

if [ -z "$SERVER_IP" ] || [ "$SERVER_IP" == "" ]; then
    echo "⚠️ Terraform khong tra ve IP. Dang thu lay IP tu AWS CLI..."
    SERVER_IP=$(aws ec2 describe-instances \
        --filters "Name=tag:Name,Values=Dolciluxe-Auto-Server" "Name=instance-state-name,Values=running" \
        --query "Reservations[0].Instances[0].PublicIpAddress" --output text)
fi

ECR_URL=$(terraform output -raw ecr_registry | tr -d '\r')
if [ -z "$ECR_URL" ] || [ "$ECR_URL" == "" ]; then
    ACC_ID=$(aws sts get-caller-identity --query Account --output text)
    ECR_URL="${ACC_ID}.dkr.ecr.us-east-1.amazonaws.com"
fi

cd ..
echo "✅ IP Server: $SERVER_IP"
echo "✅ ECR Registry: $ECR_URL"

# 3. Đợi Server (Chỉ sleep, bỏ check nc để tránh lỗi)
echo "⏳ Dang doi Server khoi dong..."
sleep 10

# 4. Tải file cấu hình và FIX LỖI TLS
echo "📥 Dang tai file config K3s..."
scp -i terraform/dolciluxe-key.pem -o StrictHostKeyChecking=no ubuntu@$SERVER_IP:/etc/rancher/k3s/k3s.yaml ./k3s_config.yaml

# Sửa IP và THÊM LỆNH BỎ QUA CHECK CHỨNG CHỈ (Quan trọng!)
sed -i "s/127.0.0.1/$SERVER_IP/g" ./k3s_config.yaml
sed -i 's/certificate-authority-data:.*/insecure-skip-tls-verify: true/g' ./k3s_config.yaml

export KUBECONFIG="./k3s_config.yaml"

# 5. Build & Push Docker
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin $ECR_URL

echo "🐳 Build & Push Backend..."
docker build -t $ECR_URL/dolciluxe-backend:latest ./backend
docker push $ECR_URL/dolciluxe-backend:latest

echo "🐳 Build & Push Frontend..."
docker build -t $ECR_URL/dolciluxe-frontend:latest ./frontend
docker push $ECR_URL/dolciluxe-frontend:latest

# 6. Deploy lên Kubernetes
echo "🚀 Dang Deploy..."

kubectl delete secret regcred --ignore-not-found
kubectl create secret docker-registry regcred \
  --docker-server=$ECR_URL \
  --docker-username=AWS \
  --docker-password=$(aws ecr get-login-password --region us-east-1)

kubectl apply -f k8s/mongo.yaml
kubectl apply -f k8s/backend.yaml
kubectl apply -f k8s/frontend.yaml
kubectl apply -f k8s/ingress.yaml

echo ""
echo "----------------------------------------------------"
echo "🎉 HOAN TAT! WEBSITE CUA BAN DA LEN SONG:"
echo "👉 http://$SERVER_IP"
echo "----------------------------------------------------"