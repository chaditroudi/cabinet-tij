FROM nginx:alpine

# Copy custom nginx config
COPY ./nginx/default.conf /etc/nginx/conf.d/default.conf

# Copy React dist files to Nginx html folder
COPY ./ctij-frontend/dist /usr/share/nginx/html
