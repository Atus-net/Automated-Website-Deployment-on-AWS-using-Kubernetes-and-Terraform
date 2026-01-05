output "vpc_id" {
  description = "ID của VPC vừa tạo"
  value       = aws_vpc.k3s_vpc.id
}

output "subnet_id" {
  description = "ID của Subnet (Cần nhớ cái này để Stage 2 đặt máy vào)"
  value       = aws_subnet.k3s_subnet.id
}

output "security_group_id" {
  description = "ID của Security Group"
  value       = aws_security_group.k3s_sg.id
}