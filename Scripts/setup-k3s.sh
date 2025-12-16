#!/bin/bash
# Script cài đặt K3s (Lightweight Kubernetes)

echo "--- 🚀 Bắt đầu cài đặt K3s ---"

# 1. Cài đặt K3s (Không cài Traefik mặc định để tự quản lý Ingress sau này cho chủ động)
curl -sfL https://get.k3s.io | INSTALL_K3S_EXEC="--disable=traefik" sh -

# 2. Cấp quyền đọc file config (để không phải dùng sudo mỗi khi gõ lệnh)
mkdir -p ~/.kube
sudo cp /etc/rancher/k3s/k3s.yaml ~/.kube/config
sudo chown $(id -u):$(id -g) ~/.kube/config
echo "export KUBECONFIG=~/.kube/config" >> ~/.bashrc
source ~/.bashrc

# 3. Cài đặt Helm (Công cụ quản lý gói cho K3s)
curl https://raw.githubusercontent.com/helm/helm/main/scripts/get-helm-3 | bash

kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.10.1/deploy/static/provider/cloud/deploy.yaml

echo "--- ✅ Cài đặt K3s hoàn tất! ---"
echo "Kiểm tra bằng lệnh: kubectl get nodes"