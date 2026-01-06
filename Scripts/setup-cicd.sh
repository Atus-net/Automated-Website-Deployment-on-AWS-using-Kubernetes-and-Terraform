#!/usr/bin/env bash
set -euo pipefail

exec > >(tee -a /var/log/setup-cicd.log) 2>&1
echo "[INFO] setup-cicd.sh started at $(date -Is)"

export DEBIAN_FRONTEND=noninteractive

# ----------------------------
# Helpers
# ----------------------------
need_root() {
  if [[ "$(id -u)" -ne 0 ]]; then
    echo "[ERROR] Please run as root (user-data runs as root)."
    exit 1
  fi
}

apt_install() {
  apt-get update -y
  apt-get install -y --no-install-recommends "$@"
}

need_root

# ----------------------------
# Base packages
# ----------------------------
apt_install ca-certificates curl gnupg lsb-release git jq unzip

# ----------------------------
# Docker
# ----------------------------
if ! command -v docker >/dev/null 2>&1; then
  echo "[INFO] Installing Docker..."
  install -m 0755 -d /etc/apt/keyrings
  curl -fsSL https://download.docker.com/linux/ubuntu/gpg | gpg --dearmor -o /etc/apt/keyrings/docker.gpg
  chmod a+r /etc/apt/keyrings/docker.gpg

  echo \
    "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
    $(. /etc/os-release && echo "$VERSION_CODENAME") stable" \
    > /etc/apt/sources.list.d/docker.list

  apt-get update -y
  apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
  systemctl enable --now docker
fi

# allow ubuntu & jenkins to run docker without sudo (for labs)
for u in ubuntu jenkins; do
  if id "$u" >/dev/null 2>&1; then
    usermod -aG docker "$u" || true
  fi
done

# ----------------------------
# Java (for Jenkins)
# ----------------------------
apt_install fontconfig openjdk-17-jre

# ----------------------------
# Jenkins
# ----------------------------
if ! systemctl is-enabled jenkins >/dev/null 2>&1; then
  echo "[INFO] Installing Jenkins..."
  curl -fsSL https://pkg.jenkins.io/debian-stable/jenkins.io-2023.key | tee /usr/share/keyrings/jenkins-keyring.asc > /dev/null
  echo deb [signed-by=/usr/share/keyrings/jenkins-keyring.asc] https://pkg.jenkins.io/debian-stable binary/ \
    > /etc/apt/sources.list.d/jenkins.list

  apt-get update -y
  apt-get install -y jenkins
  systemctl enable --now jenkins
fi

# Print initial admin password to log (do NOT hardcode passwords)
if [[ -f /var/lib/jenkins/secrets/initialAdminPassword ]]; then
  echo "[INFO] Jenkins initial admin password:"
  cat /var/lib/jenkins/secrets/initialAdminPassword
fi

# ----------------------------
# Trivy (container scanning) - optional but useful
# ----------------------------
if ! command -v trivy >/dev/null 2>&1; then
  echo "[INFO] Installing Trivy..."
  apt_install wget
  wget -qO - https://aquasecurity.github.io/trivy-repo/deb/public.key | gpg --dearmor -o /usr/share/keyrings/trivy.gpg
  echo "deb [signed-by=/usr/share/keyrings/trivy.gpg] https://aquasecurity.github.io/trivy-repo/deb $(. /etc/os-release && echo $VERSION_CODENAME) main" \
    > /etc/apt/sources.list.d/trivy.list
  apt-get update -y
  apt-get install -y trivy
fi

# ----------------------------
# kubectl + helm (for Jenkins deploy)
# ----------------------------
if ! command -v kubectl >/dev/null 2>&1; then
  echo "[INFO] Installing kubectl..."
  install -m 0755 -d /etc/apt/keyrings
  curl -fsSL https://pkgs.k8s.io/core:/stable:/v1.29/deb/Release.key | gpg --dearmor -o /etc/apt/keyrings/kubernetes-apt-keyring.gpg
  echo "deb [signed-by=/etc/apt/keyrings/kubernetes-apt-keyring.gpg] https://pkgs.k8s.io/core:/stable:/v1.29/deb/ /" \
    > /etc/apt/sources.list.d/kubernetes.list
  apt-get update -y
  apt-get install -y kubectl
fi

if ! command -v helm >/dev/null 2>&1; then
  echo "[INFO] Installing Helm..."
  curl -fsSL https://raw.githubusercontent.com/helm/helm/main/scripts/get-helm-3 | bash
fi

# ----------------------------
# SonarQube (optional) - run via Docker
# ----------------------------
# Uncomment if you really need SonarQube in your demo.
# NOTE: Sonar needs vm.max_map_count
# sysctl -w vm.max_map_count=262144
# echo "vm.max_map_count=262144" > /etc/sysctl.d/99-sonarqube.conf
# docker run -d --name sonarqube -p 9000:9000 sonarqube:lts-community

echo "[INFO] setup-cicd.sh completed at $(date -Is)"
