# File: ingress.tf

# 1. Tạo Namespace cho Ingress
resource "kubernetes_namespace" "ingress_nginx" {
  metadata {
    name = "ingress-nginx"
  }
}

# 2. Cài đặt Nginx Ingress Controller bằng Helm
resource "helm_release" "nginx_ingress" {
  name       = "ingress-nginx"
  repository = "https://kubernetes.github.io/ingress-nginx"
  chart      = "ingress-nginx"
  namespace  = kubernetes_namespace.ingress_nginx.metadata[0].name
  
  # Đợi namespace tạo xong mới cài
  depends_on = [kubernetes_namespace.ingress_nginx]

  # Cấu hình Service là LoadBalancer để nhận IP Public
  set {
    name  = "controller.service.type"
    value = "LoadBalancer"
  }

  # 👇 QUAN TRỌNG: Cấu hình mở thêm cổng 8080 (Thay cho lệnh patch thủ công)
  values = [
    <<EOF
controller:
  service:
    ports:
      http: 80
      https: 443
      proxied-8080: 8080
    targetPorts:
      proxied-8080: http
EOF
  ]
}