# --- DATA SOURCE ---
data "aws_ami" "ubuntu" {
  most_recent = true
  filter {
    name   = "name"
    values = ["ubuntu/images/hvm-ssd/ubuntu-jammy-22.04-amd64-server-*"]
  }
  filter {
    name   = "virtualization-type"
    values = ["hvm"]
  }
  owners = ["099720109477"] 
}

# --- COMPUTE (EC2 Instances) ---

# Máy 1: K3s App Server
resource "aws_instance" "k3s_server" {
  ami           = data.aws_ami.ubuntu.id 
  instance_type = "t3.medium"
  key_name      = "dolciluxe-key-final" 
  
  # Terraform tự động tìm resource này bên file network.tf
  vpc_security_group_ids = [aws_security_group.k3s_sg.id]
  subnet_id              = aws_subnet.k3s_subnet.id
  
  user_data = file("${path.module}/../scripts/setup-k3s.sh") 
  
  tags = { Name = "Server-1-K3s-App" }
}

# Máy 2: Jenkins Server
resource "aws_instance" "jenkins_server" {
  ami           = data.aws_ami.ubuntu.id
  instance_type = "t3.medium"
  key_name      = "dolciluxe-key-final" 
  
  vpc_security_group_ids = [aws_security_group.k3s_sg.id]
  subnet_id              = aws_subnet.k3s_subnet.id
  user_data              = file("${path.module}/../scripts/setup-cicd.sh")
  
  tags = { Name = "Server-2-Jenkins" }
}

# --- UTILITY ---
resource "time_sleep" "wait_for_k3s" {
  depends_on      = [aws_instance.k3s_server]
  create_duration = "90s"
}