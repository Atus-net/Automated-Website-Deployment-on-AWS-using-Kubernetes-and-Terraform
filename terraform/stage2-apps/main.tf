#############################
# Stage 2 - Apps (EC2 nodes)
# - Ubuntu 22.04 AMI via data source (no hardcode)
# - Reads subnet + SG IDs from Stage 1 via terraform_remote_state (local)
# - Creates: DevOps node + K3s master + K3s workers
# - Generates ansible/inventory.ini via local_file + template
#############################

# -----------------------------
# Data: AMI (Ubuntu 22.04 LTS)
# -----------------------------
data "aws_ami" "ubuntu_2204" {
  most_recent = true
  owners      = ["099720109477"] # Canonical

  filter {
    name   = "name"
    values = ["ubuntu/images/hvm-ssd/ubuntu-jammy-22.04-amd64-server-*"]
  }

  filter {
    name   = "virtualization-type"
    values = ["hvm"]
  }
}

# -------------------------------------------------------
# Read outputs from Stage 1 (local state file)
# -------------------------------------------------------
data "terraform_remote_state" "stage1" {
  backend = "local"
  config = {
    path = "../stage1-infra/terraform.tfstate"
  }
}

locals {
  subnet_id    = data.terraform_remote_state.stage1.outputs.subnet_id
  sg_devops_id = data.terraform_remote_state.stage1.outputs.sg_devops_id
  sg_master_id = data.terraform_remote_state.stage1.outputs.sg_master_id
  sg_worker_id = data.terraform_remote_state.stage1.outputs.sg_worker_id
}

# -----------------------------
# EC2: DevOps node (Jenkins on EC2)
# -----------------------------
resource "aws_instance" "devops_node" {
  ami           = data.aws_ami.ubuntu_2204.id
  instance_type = var.devops_instance_type
  key_name      = var.key_name
  subnet_id     = local.subnet_id

  vpc_security_group_ids = [local.sg_devops_id]

  # IMDSv2
  metadata_options {
    http_endpoint = "enabled"
    http_tokens   = "required"
  }

  # Bigger disk for Jenkins/Docker
  root_block_device {
    volume_type = "gp3"
    volume_size = 50
    encrypted   = true
  }

  user_data = file(var.devops_user_data_path)

  tags = {
    Name = "DevOps-Node"
    Role = "devops"
  }
}

# -----------------------------
# EC2: K3s master
# -----------------------------
resource "aws_instance" "k3s_master" {
  ami           = data.aws_ami.ubuntu_2204.id
  instance_type = var.k3s_instance_type
  key_name      = var.key_name
  subnet_id     = local.subnet_id

  vpc_security_group_ids = [local.sg_master_id]

  metadata_options {
    http_endpoint = "enabled"
    http_tokens   = "required"
  }

  tags = {
    Name = "K3s-Master"
    Role = "master"
  }
}

# -----------------------------
# EC2: K3s workers
# -----------------------------
resource "aws_instance" "k3s_worker" {
  count         = var.worker_count
  ami           = data.aws_ami.ubuntu_2204.id
  instance_type = var.k3s_instance_type
  key_name      = var.key_name
  subnet_id     = local.subnet_id

  vpc_security_group_ids = [local.sg_worker_id]

  metadata_options {
    http_endpoint = "enabled"
    http_tokens   = "required"
  }

  tags = {
    Name = "K3s-Worker-${count.index + 1}"
    Role = "worker"
  }
}

# -----------------------------
# Generate Ansible inventory.ini
# NOTE: workers MUST join via master PRIVATE IP (stable across lab reset)
# -----------------------------
locals {
  worker_ips = [for w in aws_instance.k3s_worker : w.public_ip]

  # map role by index: 0=frontend,1=backend,2=database, others=monitor
  worker_roles = [
    for i in range(length(local.worker_ips)) :
    i == 0 ? "frontend" :
    i == 1 ? "backend" :
    i == 2 ? "database" : "monitor"
  ]

  inventory = templatefile("${path.module}/templates/inventory.tftpl", {
    devops_ip         = aws_instance.devops_node.public_ip
    master_ip         = aws_instance.k3s_master.public_ip
    master_private_ip = aws_instance.k3s_master.private_ip

    worker_ips        = local.worker_ips
    worker_roles      = local.worker_roles
    ansible_user      = var.ansible_user
    private_key       = var.ansible_private_key_path
  })
}

resource "local_file" "ansible_inventory" {
  filename = var.ansible_inventory_path
  content  = local.inventory
}
