# Stage 1: Build React app with Vite
FROM node:18-alpine AS builder
WORKDIR /app

# Copy package.json and package-lock.json (if exists)
COPY package*.json ./ 

# Install dependencies
RUN npm install

# Copy the rest of your app's source code
COPY . .

# Build the React app using Vite
RUN npm run build

# Stage 2: Serve with Nginx
FROM nginx:1.27-alpine

# Copy the built app from the builder stage to Nginx's public folder
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy custom Nginx config
COPY nginx.conf /etc/nginx/nginx.conf

# Expose port 80
EXPOSE 80

# Start Nginx in the foreground
CMD ["nginx", "-g", "daemon off;"]
