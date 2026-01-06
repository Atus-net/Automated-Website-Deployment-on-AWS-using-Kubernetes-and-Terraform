output "DevOps_Node_IP" {
  description = "IP Public của máy DevOps (Jenkins)"
  value       = aws_instance.devops_node.public_ip
}

output "Master_Node_IP" {
  description = "IP Public của K3s Master Node"
  value       = aws_instance.k3s_master.public_ip
}

output "Worker_Nodes_IPs" {
  description = "Danh sách IP Public của Worker Nodes"
  value       = [for w in aws_instance.k3s_worker : w.public_ip]
}

output "Jenkins_URL" {
  description = "Link truy cập Jenkins CI/CD"
  value       = "http://${aws_instance.devops_node.public_ip}:8080"
}

output "Web_Application_URLs" {
  description = "Link truy cập Web qua Ingress (thử từng worker IP)"
  value       = [for w in aws_instance.k3s_worker : "http://${w.public_ip}"]
}

output "Command_Get_Jenkins_Password" {
  description = "Lệnh lấy mật khẩu Admin Jenkins (chạy trên WSL/Linux)"
  value       = "ssh -o StrictHostKeyChecking=no -i ~/.ssh/vockey.pem ubuntu@${aws_instance.devops_node.public_ip} 'sudo cat /var/lib/jenkins/secrets/initialAdminPassword'"
}

output "Command_SSH_DevOps" {
  description = "SSH nhanh vào DevOps node"
  value       = "ssh -i ~/.ssh/vockey.pem ubuntu@${aws_instance.devops_node.public_ip}"
}
