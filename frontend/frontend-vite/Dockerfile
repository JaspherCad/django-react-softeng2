# frontend/frontend-vite/Dockerfile
# Build stage
FROM node:20.18.3 AS build-stage

#DOCKER SPECFICI PATH. not local machine ko
WORKDIR /app

# Install dependencies and build
COPY package*.json ./
RUN npm install

# Copy the rest of the app
COPY . .

# Build the React app (Vite outputs to /dist)
RUN npm run build

# Serve with NGINX
FROM nginx:alpine
COPY --from=build-stage /app/dist /usr/share/nginx/html
# Optional: Include if you have a custom config
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]