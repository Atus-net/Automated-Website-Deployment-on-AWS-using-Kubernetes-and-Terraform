#!/bin/bash
# Cài đặt Jenkins và SonarQube tự động

echo "--- 1. Cài đặt Docker ---"
apt-get update
apt-get install -y docker.io
usermod -aG docker ubuntu
chmod 666 /var/run/docker.sock

echo "--- 2. Cài đặt SonarQube (Docker) ---"
sysctl -w vm.max_map_count=262144
sysctl -p
docker run -d --name sonarqube -p 9000:9000 -e SONAR_ES_BOOTSTRAP_CHECKS_DISABLE=true sonarqube:community

echo "--- 3. Cài đặt Jenkins ---"
# Cài Java 17 (Yêu cầu mới của Jenkins)
apt-get install -y openjdk-17-jre
# Thêm Repo Jenkins
curl -fsSL https://pkg.jenkins.io/debian-stable/jenkins.io-2023.key | sudo tee /usr/share/keyrings/jenkins-keyring.asc > /dev/null
echo deb [signed-by=/usr/share/keyrings/jenkins-keyring.asc] https://pkg.jenkins.io/debian-stable binary/ | sudo tee /etc/apt/sources.list.d/jenkins.list > /dev/null
apt-get update
apt-get install -y jenkins
systemctl start jenkins

echo "--- 4. Cài Kubectl (Để deploy sang máy kia) ---"
curl -LO "https://dl.k3s.io/release/$(curl -L -s https://dl.k3s.io/release/stable.txt)/bin/linux/amd64/kubectl"
chmod +x kubectl
mv kubectl /usr/local/bin/

echo "--- XONG! ---"