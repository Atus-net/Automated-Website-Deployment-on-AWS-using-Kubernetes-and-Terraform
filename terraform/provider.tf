# provider.tf
terraform {
  required_providers {
    aws = { source = "hashicorp/aws", version = "~> 5.0" }
    helm = { source = "hashicorp/helm", version = "~> 2.0" }
    kubernetes = { source = "hashicorp/kubernetes", version = "~> 2.0" }
  }
}

provider "aws" {
  region = "us-east-1"
}

provider "kubernetes" {
  config_path = "~/.kube/config"
  insecure    = true  # <--- Thêm dòng này để bỏ qua lỗi SSL
}

provider "helm" {
  kubernetes {
    config_path = "~/.kube/config"
    insecure    = true  # <--- Thêm dòng này nữa
  }
}