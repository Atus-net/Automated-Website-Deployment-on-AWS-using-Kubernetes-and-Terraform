#!/usr/bin/env bash
set -euo pipefail

# Ghi log quá trình cài đặt
exec > >(tee -a /var/log/setup-cicd.log) 2>&1
echo "[INFO] setup-cicd.sh started at $(date -Is)"

export DEBIAN_FRONTEND=noninteractive

# --- 1. Cài đặt các gói cơ bản ---
apt-get update -y
apt-get install -y ca-certificates curl gnupg lsb-release git jq unzip fontconfig openjdk-17-jre

# --- 2. Cài đặt Docker ---
if ! command -v docker >/dev/null 2>&1; then
  echo "[INFO] Installing Docker..."
  install -m 0755 -d /etc/apt/keyrings
  curl -fsSL https://download.docker.com/linux/ubuntu/gpg | gpg --dearmor -o /etc/apt/keyrings/docker.gpg
  echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu $(. /etc/os-release && echo "$VERSION_CODENAME") stable" > /etc/apt/sources.list.d/docker.list
  apt-get update -y && apt-get install -y docker-ce docker-ce-cli containerd.io
  systemctl enable --now docker
fi

# Cấp quyền cho user
for u in ubuntu jenkins; do
  if id "$u" >/dev/null 2>&1; then usermod -aG docker "$u" || true; fi
done

# --- 3. Chuẩn bị thư mục & cấu hình Prometheus (Mới) ---
mkdir -p /etc/prometheus
cat <<EOF > /etc/prometheus/prometheus.yml
global:
  scrape_interval: 15s
scrape_configs:
  - job_name: 'prometheus'
    static_configs:
      - targets: ['localhost:9090']
EOF

# --- 4. Cài đặt Jenkins ---
if ! systemctl is-enabled jenkins >/dev/null 2>&1; then
  curl -fsSL https://pkg.jenkins.io/debian-stable/jenkins.io-2023.key | tee /usr/share/keyrings/jenkins-keyring.asc > /dev/null
  echo deb [signed-by=/usr/share/keyrings/jenkins-keyring.asc] https://pkg.jenkins.io/debian-stable binary/ > /etc/apt/sources.list.d/jenkins.list
  apt-get update -y && apt-get install -y jenkins
  systemctl enable --now jenkins
fi

# --- 5. Tối ưu Kernel cho SonarQube ---
sysctl -w vm.max_map_count=262144
echo "vm.max_map_count=262144" > /etc/sysctl.d/99-sonarqube.conf

# Thông báo mật khẩu Jenkins
sleep 10
echo "-------------------------------------------------------"
if [[ -f /var/lib/jenkins/secrets/initialAdminPassword ]]; then
  echo "[SUCCESS] Jenkins Password: $(cat /var/lib/jenkins/secrets/initialAdminPassword)"
fi
echo "-------------------------------------------------------"