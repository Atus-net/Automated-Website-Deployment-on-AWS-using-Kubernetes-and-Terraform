# --- 1. THÔNG TIN IP CÁC MÁY CHỦ ---

output "DevOps_Node_IP" {
  description = "IP Public của máy DevOps (Chứa Jenkins, SonarQube, Trivy)"
  value       = aws_instance.devops_node.public_ip
}

output "Master_Node_IP" {
  description = "IP Public của K3s Master Node (Control Plane)"
  value       = aws_instance.k3s_master.public_ip
}

output "Worker_Nodes_IPs" {
  description = "Danh sách IP Public của 4 Worker Nodes"
  value       = aws_instance.k3s_worker[*].public_ip
}

# --- 2. LINK TRUY CẬP CÁC DỊCH VỤ ---

output "Web_Application_URL" {
  description = "Link truy cập trang web Dolciluxe (Qua Ingress)"
  value       = "http://${aws_instance.k3s_master.public_ip}"
}

output "Jenkins_URL" {
  description = "Link truy cập Jenkins CI/CD"
  value       = "http://${aws_instance.devops_node.public_ip}:8080"
}

output "SonarQube_URL" {
  description = "Link truy cập SonarQube (Kiểm tra code)"
  value       = "http://${aws_instance.devops_node.public_ip}:9000"
}

output "Grafana_URL" {
  description = "Link truy cập Monitoring (Grafana)"
  value       = "http://${aws_instance.k3s_master.public_ip}:31383"
}

# --- 3. CÁC LỆNH HỖ TRỢ NHANH ---

output "Command_Get_Jenkins_Password" {
  description = "Copy lệnh này chạy trên terminal để lấy mật khẩu Admin Jenkins"
  value       = "ssh -o StrictHostKeyChecking=no -i ~/.ssh/vockey.pem ubuntu@${aws_instance.devops_node.public_ip} 'sudo cat /var/lib/jenkins/secrets/initialAdminPassword'"
}

output "Command_SSH_DevOps" {
  description = "Lệnh SSH nhanh vào máy DevOps"
  value       = "ssh -i ~/.ssh/vockey.pem ubuntu@${aws_instance.devops_node.public_ip}"
}