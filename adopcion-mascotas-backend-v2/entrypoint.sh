#!/bin/sh
set -e

# Limpiar y cachear configuración
php artisan cache:clear
php artisan config:clear

# Migraciones forzadas en producción
php artisan migrate --force

# Arrancar Laravel
exec php artisan serve --host=0.0.0.0 --port=${PORT:-8000}
