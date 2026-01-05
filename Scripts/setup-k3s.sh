#!/bin/bash
# FILE: Scripts/setup-k3s.sh

echo "--- 🚀 Bắt đầu cài đặt K3s Master ---"

# 1. Cài đặt K3s (Tắt traefik để dùng Nginx Ingress của bạn)
curl -sfL https://get.k3s.io | INSTALL_K3S_EXEC="--disable=traefik --write-kubeconfig-mode 644" sh -

# 2. Cấu hình Kubeconfig cho user ROOT (để Ansible dùng được ngay)
mkdir -p ~/.kube
sudo cp /etc/rancher/k3s/k3s.yaml ~/.kube/config
sudo chown $(id -u):$(id -g) ~/.kube/config

# 3. Cấu hình Kubeconfig cho user UBUNTU (Để bạn SSH vào gõ lệnh được ngay)
mkdir -p /home/ubuntu/.kube
sudo cp /etc/rancher/k3s/k3s.yaml /home/ubuntu/.kube/config
sudo chown ubuntu:ubuntu /home/ubuntu/.kube/config
echo "export KUBECONFIG=/home/ubuntu/.kube/config" >> /home/ubuntu/.bashrc

# 4. Cài đặt Helm
curl https://raw.githubusercontent.com/helm/helm/main/scripts/get-helm-3 | bash

echo "--- ⏳ Đang chờ Node Token sẵn sàng... ---"
while [ ! -f /var/lib/rancher/k3s/server/node-token ]; do
  sleep 2
done

echo "--- ✅ Master đã sẵn sàng! Token kết nối: ---"
sudo cat /var/lib/rancher/k3s/server/node-token