# Stage 1: Build
FROM node:18-alpine as build-stage
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
# Khai báo biến nhận từ Jenkins
ARG VITE_BACKEND_URL
# Gán vào môi trường để Vite build
ENV VITE_BACKEND_URL=$VITE_BACKEND_URL

RUN npm run build 
# (Mặc định Vite build ra folder 'dist')

# Stage 2: Serve
FROM nginx:alpine
COPY --from=build-stage /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]