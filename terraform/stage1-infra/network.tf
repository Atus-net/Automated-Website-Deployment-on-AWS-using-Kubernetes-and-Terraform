# 1. Tạo VPC (Mạng riêng ảo)
resource "aws_vpc" "k3s_vpc" {
  cidr_block           = "10.0.0.0/16"
  enable_dns_hostnames = true
  
  # 👇 Tag này quan trọng để Stage 2 tìm thấy VPC
  tags = { Name = "k3s-demo-vpc" }
}

# 2. Tạo Internet Gateway (Cổng ra Internet)
resource "aws_internet_gateway" "k3s_igw" {
  vpc_id = aws_vpc.k3s_vpc.id
  tags = { Name = "k3s-demo-igw" }
}

# 3. Tạo Route Table (Bảng chỉ đường ra Internet)
resource "aws_route_table" "k3s_rt" {
  vpc_id = aws_vpc.k3s_vpc.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.k3s_igw.id
  }

  tags = { Name = "k3s-demo-rt" }
}

# 4. Tạo Subnet (Mạng con public)
resource "aws_subnet" "k3s_subnet" {
  vpc_id                  = aws_vpc.k3s_vpc.id
  cidr_block              = "10.0.1.0/24"
  map_public_ip_on_launch = true # Tự động cấp IP Public cho máy nằm trong này
  availability_zone       = "us-east-1a"
  
  # 👇 Tag này cực quan trọng: Stage 2 sẽ tìm Subnet theo tên này
  tags = { Name = "k3s-demo-subnet" }
}

# 5. Gắn Subnet vào Route Table
resource "aws_route_table_association" "k3s_rta" {
  subnet_id      = aws_subnet.k3s_subnet.id
  route_table_id = aws_route_table.k3s_rt.id
}

# 6. Tạo Security Group (Tường lửa)
resource "aws_security_group" "k3s_sg" {
  name        = "k3s-sg"
  description = "Allow all traffic for K3s Lab"
  vpc_id      = aws_vpc.k3s_vpc.id

  # Cho phép tất cả traffic vào (Ingress) - Chỉ dùng cho Lab học tập
  ingress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  # Cho phép tất cả traffic ra (Egress)
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  # 👇 Tag này quan trọng: Stage 2 sẽ tìm SG theo tên này
  tags = { Name = "k3s-sg" }
}