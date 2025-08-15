#!/bin/sh
set -e

# Limpiar y cachear configuración
php artisan cache:clear
php artisan config:clear
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Migraciones forzadas en producción
php artisan migrate --force

# Arrancar PHP-FPM
exec php-fpm
