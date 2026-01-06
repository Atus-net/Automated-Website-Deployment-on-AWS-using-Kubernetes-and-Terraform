output "vpc_id" { value = aws_vpc.this.id }
output "subnet_id" { value = aws_subnet.public.id }
output "sg_devops_id" { value = aws_security_group.devops.id }
output "sg_master_id" { value = aws_security_group.master.id }
output "sg_worker_id" { value = aws_security_group.worker.id }
