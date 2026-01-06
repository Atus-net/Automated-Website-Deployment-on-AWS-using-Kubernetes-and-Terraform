# Runbook (AWS Academy / Canvas Lab)

## 0) Prereqs
- Terraform installed on Windows
- WSL Ubuntu for Ansible (recommended)
- You have an AWS key pair name (e.g. `vockey`) **already created in the Lab**

## 1) Start Lab (every time)
1. Copy AWS Academy credentials into environment variables on Windows PowerShell:
   - AWS_ACCESS_KEY_ID
   - AWS_SECRET_ACCESS_KEY
   - AWS_SESSION_TOKEN
   - AWS_DEFAULT_REGION=us-east-1

2. Clean local Terraform cache/state (lab accounts reset):
```powershell
Remove-Item -Recurse -Force .\terraform\stage1-infra\.terraform -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force .\terraform\stage2-apps\.terraform -ErrorAction SilentlyContinue
Remove-Item -Force .\terraform\stage1-infra\terraform.tfstate* -ErrorAction SilentlyContinue
Remove-Item -Force .\terraform\stage2-apps\terraform.tfstate* -ErrorAction SilentlyContinue
Remove-Item -Force .\ansible\inventory.ini -ErrorAction SilentlyContinue
```

## 2) Terraform apply
### Stage 1 (network + SGs)
```powershell
cd .\terraform\stage1-infra
terraform init
terraform apply -auto-approve -var="admin_cidr=YOUR_PUBLIC_IP/32"
```

### Stage 2 (EC2: devops + k3s master + workers)
```powershell
cd ..\stage2-apps
terraform init
terraform apply -auto-approve
```

Terraform sẽ tự generate `ansible/inventory.ini`.

## 3) Prepare Ansible secrets
Create `ansible/vars/secrets.yml` from the example:
- Copy `ansible/vars/secrets.example.yml` -> `ansible/vars/secrets.yml`
- Fill values
- (Optional) encrypt it with ansible-vault

## 4) Run Ansible from WSL
```bash
cd /mnt/d/UIT/Automated-Website-Deployment-on-AWS-using-Kubernetes-and-Terraform/ansible
ansible-galaxy collection install -r collections/requirements.yml
ansible-playbook -i inventory.ini site.yml
```

## 5) Access
- Jenkins: http://DEVOPS_PUBLIC_IP:8080
- SonarQube (if enabled): http://DEVOPS_PUBLIC_IP:9000
- App: http://WORKER_1_PUBLIC_IP/
