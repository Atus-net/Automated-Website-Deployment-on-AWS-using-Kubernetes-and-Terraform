apiVersion: v1
kind: Service
metadata:
  name: frontend
spec:
  # LoadBalancer sẽ xin AWS cấp cho 1 cái Public IP (truy cập từ internet)
  type: LoadBalancer
  selector:
    app: frontend
  ports:
    - protocol: TCP
      port: 80
      targetPort: 80
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: frontend
spec:
  replicas: 1
  selector:
    matchLabels:
      app: frontend
  template:
    metadata:
      labels:
        app: frontend
    spec:
      # --- [QUAN TRỌNG] CHÌA KHÓA TẢI ẢNH ---
      imagePullSecrets:
        - name: regcred

      containers:
        - name: frontend
          # 👇 [SỬA TỰ ĐỘNG] Dùng biến để Terraform điền URL ECR mới vào
          image: ${ecr_url}/dolciluxe-frontend:latest
          ports:
            - containerPort: 80