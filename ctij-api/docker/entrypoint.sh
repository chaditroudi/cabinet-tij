#!/bin/bash

# Wait for MySQL to be ready
until mysql -h"$DB_HOST" -u"$DB_USERNAME" -p"$DB_PASSWORD" -e "SELECT 1;" &> /dev/null; do
  echo "Waiting for MySQL..."
  sleep 2
done

# Run migrations
echo "Running Laravel migrations..."
php artisan migrate --force

# Start PHP-FPM
exec "$@"
