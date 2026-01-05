# Stage 1: Build
FROM node:18-alpine as build-stage
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

# ❌ ĐÃ XÓA DÒNG ENV VITE_BACKEND_URL (Để code tự nhận diện IP động)

RUN npm run build 

# Stage 2: Serve
FROM nginx:alpine
COPY --from=build-stage /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]