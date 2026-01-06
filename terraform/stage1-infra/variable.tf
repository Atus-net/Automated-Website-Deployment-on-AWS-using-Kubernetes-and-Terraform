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

variable "vpc_cidr" {
  type    = string
  default = "10.0.0.0/16"
}

variable "public_subnet_cidr" {
  type    = string
  default = "10.0.1.0/24"
}

variable "admin_cidr" {
  type        = string
  description = "Your public IP in CIDR form, e.g. 1.2.3.4/32"
}
