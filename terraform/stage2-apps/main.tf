# --- PHẦN 1: TÌM LẠI HẠ TẦNG TỪ STAGE 1 (Data Source) ---

# 1. Tìm Subnet dựa trên Tag Name
data "aws_subnet" "selected_subnet" {
  filter {
    name   = "tag:Name"
    values = ["k3s-demo-subnet"] # Tên này phải khớp với file network.tf ở Stage 1
  }
}

# 2. Tìm Security Group dựa trên Tag Name
data "aws_security_group" "selected_sg" {
  filter {
    name   = "tag:Name"
    values = ["k3s-sg"] # Tên này phải khớp với file network.tf ở Stage 1
  }
}

# 3. Tìm AMI Ubuntu 22.04 mới nhất
data "aws_ami" "ubuntu" {
  most_recent = true
  owners      = ["099720109477"] # Canonical
  filter {
    name   = "name"
    values = ["ubuntu/images/hvm-ssd/ubuntu-jammy-22.04-amd64-server-*"]
  }
}

# --- PHẦN 2: TẠO MÁY CHỦ (Compute Resources) ---

# 1. DevOps Node (Chạy Jenkins, SonarQube)
resource "aws_instance" "devops_node" {
  ami                    = data.aws_ami.ubuntu.id
  instance_type          = "t3.medium"
  key_name               = var.key_name
  subnet_id              = data.aws_subnet.selected_subnet.id      # <--- Lấy ID từ data
  vpc_security_group_ids = [data.aws_security_group.selected_sg.id] # <--- Lấy ID từ data
  
  # Đảm bảo đường dẫn tới script setup CICD là chính xác trên máy bạn
  user_data              = file("../../Scripts/setup-cicd.sh") 
  
  tags                   = { Name = "DevOps-Node" }
}

# 2. Master Node (K3s Control Plane)
resource "aws_instance" "k3s_master" {
  ami                    = data.aws_ami.ubuntu.id
  instance_type          = "t3.medium"
  key_name               = var.key_name
  subnet_id              = data.aws_subnet.selected_subnet.id
  vpc_security_group_ids = [data.aws_security_group.selected_sg.id]
  tags                   = { Name = "K3s-Master" }
}

# 3. Worker Nodes (4 nodes)
resource "aws_instance" "k3s_worker" {
  count                  = 4
  ami                    = data.aws_ami.ubuntu.id
  instance_type          = "t3.medium"
  key_name               = var.key_name
  subnet_id              = data.aws_subnet.selected_subnet.id
  vpc_security_group_ids = [data.aws_security_group.selected_sg.id]
  tags                   = { Name = "K3s-Worker-${count.index}" }
}

# --- PHẦN 3: TẠO FILE INVENTORY CHO ANSIBLE ---

resource "local_file" "ansible_inventory" {
  content = <<-EOT
    [masters]
    master_node ansible_host=${aws_instance.k3s_master.public_ip}

    [workers]
    # Phân chia role cho từng worker để Ansible cài đúng chỗ
    worker-0 ansible_host=${aws_instance.k3s_worker[0].public_ip} node_role=frontend
    worker-1 ansible_host=${aws_instance.k3s_worker[1].public_ip} node_role=backend
    worker-2 ansible_host=${aws_instance.k3s_worker[2].public_ip} node_role=database
    worker-3 ansible_host=${aws_instance.k3s_worker[3].public_ip} node_role=monitor
    
    [devops]
    devops_node ansible_host=${aws_instance.devops_node.public_ip}
    
    [all:vars]
    ansible_user=ubuntu
    ansible_ssh_private_key_file=~/.ssh/vockey.pem
    ansible_ssh_common_args='-o StrictHostKeyChecking=no'
  EOT
  filename = "../../ansible/inventory.ini"
}
