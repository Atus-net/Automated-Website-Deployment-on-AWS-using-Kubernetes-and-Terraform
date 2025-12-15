# Sử dụng Node.js bản nhẹ
FROM node:18-alpine

WORKDIR /app

# Copy package.json để cài thư viện trước (tận dụng cache)
COPY package*.json ./

# Cài đặt dependencies
RUN npm install

# Copy toàn bộ code vào
COPY . .

# Expose port (Dựa vào code thường là 5000 hoặc 8000. Bạn check file .env hoặc server.js nhé)
EXPOSE 8080

# Lệnh chạy server (lấy từ scripts trong package.json)
CMD ["node", "server.js"]