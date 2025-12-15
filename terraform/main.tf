terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 4.16"
    }
  }
  required_version = ">= 1.2.0"
}

provider "aws" {
  region = "us-east-1"
}

# --- 1. THIẾT LẬP MẠNG (VPC) ---
resource "aws_vpc" "main_vpc" {
  cidr_block           = "10.0.0.0/16"
  enable_dns_support   = true
  enable_dns_hostnames = true
  tags = { Name = "Dolciluxe-VPC" }
}

resource "aws_internet_gateway" "igw" {
  vpc_id = aws_vpc.main_vpc.id
}

resource "aws_subnet" "main_subnet" {
  vpc_id                  = aws_vpc.main_vpc.id
  cidr_block              = "10.0.1.0/24"
  map_public_ip_on_launch = true
  availability_zone       = "us-east-1a"
}

resource "aws_route_table" "public_rt" {
  vpc_id = aws_vpc.main_vpc.id
  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.igw.id
  }
}

resource "aws_route_table_association" "a" {
  subnet_id      = aws_subnet.main_subnet.id
  route_table_id = aws_route_table.public_rt.id
}

# --- 2. BẢO MẬT (SECURITY GROUP) ---
# Mở tất cả các port để bạn cài Jenkins, Sonar, K8s thoải mái không lỗi mạng
resource "aws_security_group" "allow_all_tools" {
  name        = "allow_devops_tools_v2"
  description = "Allow all traffic for Capstone Project"
  vpc_id      = aws_vpc.main_vpc.id

  ingress {
    description = "Allow All Traffic"
    from_port   = 0
    to_port     = 0
    protocol    = "-1" # Mở tất cả giao thức
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

# --- 3. TẠO KHÓA SSH ---
resource "tls_private_key" "pk" {
  algorithm = "RSA"
  rsa_bits  = 4096
}

resource "aws_key_pair" "deployer" {
  key_name   = "dolciluxe-key-final"
  public_key = tls_private_key.pk.public_key_openssh
}

resource "local_file" "ssh_key" {
  content         = tls_private_key.pk.private_key_pem
  filename        = "${path.module}/dolciluxe-key-final.pem"
  file_permission = "0400"
}

# --- 4. MÁY 1: MANAGEMENT (Jenkins + SonarQube) ---
resource "aws_instance" "jenkins_server" {
  ami           = "ami-04b70fa74e45c3917" # Ubuntu 24.04 LTS (us-east-1)
  instance_type = "t3.medium"            # 4GB RAM
  key_name      = aws_key_pair.deployer.key_name
  subnet_id     = aws_subnet.main_subnet.id
  vpc_security_group_ids = [aws_security_group.allow_all_tools.id]

  root_block_device {
    volume_size = 20 # 20GB ổ cứng
  }

  tags = {
    Name = "Management-Server (Jenkins-Sonar)"
  }
}

# --- 5. MÁY 2: PRODUCTION (K3s + Web App + Prometheus) ---
resource "aws_instance" "prod_server" {
  ami           = "ami-04b70fa74e45c3917" # Ubuntu 24.04 LTS (us-east-1)
  instance_type = "t3.medium"            # 4GB RAM
  key_name      = aws_key_pair.deployer.key_name
  subnet_id     = aws_subnet.main_subnet.id
  vpc_security_group_ids = [aws_security_group.allow_all_tools.id]

  root_block_device {
    volume_size = 20 # 20GB ổ cứng
  }

  tags = {
    Name = "Production-Server (K3s-App)"
  }
}

# --- OUTPUT IP (Để bạn SSH) ---
output "jenkins_ip" {
  value = aws_instance.jenkins_server.public_ip
}

output "prod_ip" {
  value = aws_instance.prod_server.public_ip
}