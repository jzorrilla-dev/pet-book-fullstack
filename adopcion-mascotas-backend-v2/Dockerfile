# Etapa 1: Instalar dependencias y Composer
FROM php:8.2-fpm-alpine AS builder

WORKDIR /var/www/html

# Instalar paquetes necesarios y extensiones PHP
RUN apk add --no-cache \
    git \
    curl \
    libpng-dev \
    libjpeg-turbo-dev \
    postgresql-dev \
    bash \
    unzip \
    oniguruma-dev

RUN docker-php-ext-install pdo_pgsql mbstring exif pcntl bcmath opcache

# Copiar todo el proyecto primero (incluye artisan)
COPY . ./

# Instalar Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer
RUN composer install --no-dev --optimize-autoloader --prefer-dist

# Ajustar permisos
RUN chown -R www-data:www-data storage bootstrap/cache \
    && chmod -R 775 storage bootstrap/cache

# Copiar entrypoint y darle permisos
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

EXPOSE 9000
CMD ["/entrypoint.sh"]
