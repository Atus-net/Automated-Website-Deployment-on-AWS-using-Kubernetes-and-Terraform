variable "region" {
  type    = string
  default = "us-east-1"
}

variable "project" {
  type    = string
  default = "k3s-demo"
}

variable "env" {
  type    = string
  default = "lab"
}

variable "key_name" {
  type    = string
  default = "vockey"
}


variable "devops_instance_type" {
  type    = string
  default = "t3.medium"
}

variable "k3s_instance_type" {
  type    = string
  default = "t3.small"
}

variable "worker_count" {
  type    = number
  default = 3
}

variable "devops_user_data_path" {
  type    = string
  default = "../../Scripts/setup-cicd.sh"
}

variable "ansible_inventory_path" {
  type    = string
  default = "../../ansible/inventory.ini"
}

variable "ansible_user" {
  type    = string
  default = "ubuntu"
}

variable "ansible_private_key_path" {
  type    = string
  default = "~/.ssh/vockey.pem"
}
