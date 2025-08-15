# Etapa 1: Instalar dependencias y Composer
FROM php:8.2-fpm-alpine AS builder

# Directorio de trabajo
WORKDIR /var/www/html

# Actualizar paquetes y agregar extensiones necesarias
RUN apk add --no-cache \
    git \
    curl \
    libpng-dev \
    libjpeg-turbo-dev \
    postgresql-dev \
    bash \
    unzip \
    oniguruma-dev

# Instalar extensiones PHP
RUN docker-php-ext-install pdo_pgsql mbstring exif pcntl bcmath opcache

# Copiar archivos de Composer para cachear dependencias
COPY ./adopcion-mascotas-backend-v2/composer.json ./adopcion-mascotas-backend-v2/composer.lock ./

# Instalar Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer
RUN composer install --no-dev --optimize-autoloader --prefer-dist

# Copiar el resto del código
COPY ./adopcion-mascotas-backend-v2 ./

# Ajustar permisos
RUN chown -R www-data:www-data storage bootstrap/cache \
    && chmod -R 775 storage bootstrap/cache

# Copiar entrypoint y darle permisos
COPY ./adopcion-mascotas-backend-v2/entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

# Exponer puerto interno para PHP-FPM
EXPOSE 9000

# Comando de arranque
CMD ["/entrypoint.sh"]
