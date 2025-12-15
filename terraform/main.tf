# terraform {
#   required_providers {
#     aws = {
#       source  = "hashicorp/aws"
#       version = "~> 5.0"
#     }
#   }
# }

# provider "aws" {
#   region = "us-east-1"
# }

# 1. Tạo Security Group (Mở cửa cho web và k3s)
resource "aws_security_group" "k3s_sg" {
  name        = "k3s-security-group"
  description = "Allow Web, SSH and K8s traffic"

  ingress { # SSH
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
  ingress { # HTTP (Web)
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
  ingress { # HTTPS
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
  ingress { # K3s API (Để máy bạn kết nối kubectl vào)
    from_port   = 6443
    to_port     = 6443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
  ingress { # NodePort (Dự phòng)
    from_port   = 30000
    to_port     = 32767
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress { # Cho phép server ra internet
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

# 2. Tạo Máy ảo EC2 (T3.Medium là đủ mạnh)
resource "aws_instance" "k3s_server" {
  ami           = "ami-0c7217cdde317cfec" # Ubuntu 22.04 LTS (us-east-1)
  instance_type = "t3.medium"
  key_name      = "dolciluxe-key" # Tên Key Pair (Xem hướng dẫn tạo ở dưới)

  user_data = <<-EOF
            #!/bin/bash
            # Cài đặt K3s (Kubernetes nhẹ)
            curl -sfL https://get.k3s.io | sh -
            
            # Cấu hình quyền truy cập config cho user ubuntu
            mkdir -p /home/ubuntu/.kube
            cp /etc/rancher/k3s/k3s.yaml /home/ubuntu/.kube/config
            chown ubuntu:ubuntu /home/ubuntu/.kube/config
            chmod 600 /home/ubuntu/.kube/config
            
            # Cho phép ghi đè biến môi trường KUBECONFIG
            echo 'export KUBECONFIG=/home/ubuntu/.kube/config' >> /home/ubuntu/.bashrc
            EOF

  vpc_security_group_ids = [aws_security_group.k3s_sg.id]

  tags = {
    Name = "Dolciluxe-K3s-Server"
  }
}

output "server_public_ip" {
  value = aws_instance.k3s_server.public_ip
}
