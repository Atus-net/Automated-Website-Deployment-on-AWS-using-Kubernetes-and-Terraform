# --- OUTPUTS ---

# 1. Đường dẫn Grafana (Trên máy K3s)
output "Grafana_Dashboard" {
  description = "Trang giám sát hệ thống"
  value       = "http://${aws_instance.k3s_server.public_ip}:31383"
}
# 2. Thông tin đăng nhập Grafana
output "Grafana_Account" {
  description = "Tài khoản đăng nhập Grafana (Đã set trong monitoring.tf)"
  value       = "User: admin | Pass: admin123"
}

# 3. Thông tin đăng nhập SonarQube
output "SonarQube_Account" {
  description = "Tài khoản mặc định SonarQube"
  value       = "User: admin | Pass: admin (Sẽ yêu cầu đổi ngay lần đầu login)"
}

# 4. Đường dẫn Jenkins (Trên máy Jenkins)
output "Jenkins_CI_CD" {
  description = "Trang quản lý CI/CD"
  value       = "http://${aws_instance.jenkins_server.public_ip}:8080"
}

# 5. Hướng dẫn lấy mật khẩu Jenkins
output "Jenkins_Password_Command" {
  description = "Lệnh lấy mật khẩu Jenkins (Chạy trong Git Bash)"
  value       = "ssh -i dolciluxe-key-final.pem ubuntu@${aws_instance.jenkins_server.public_ip} 'sudo cat /var/lib/jenkins/secrets/initialAdminPassword'"
}

output "Website_Application_URL" {
  description = "Link trang web ứng dụng (Sau khi Jenkins deploy xong)"
  value       = "http://${aws_instance.k3s_server.public_ip}"
}