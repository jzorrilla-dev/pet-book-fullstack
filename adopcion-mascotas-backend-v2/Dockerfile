# Usa una imagen base de PHP con FPM
FROM php:8.2-fpm-alpine

# Define el directorio de trabajo
WORKDIR /var/www/html

# Actualiza paquetes del sistema y limpia el caché
RUN apk upgrade --no-cache && \
    rm -rf /var/cache/apk/*

# Instala dependencias del sistema operativo y extensiones de PHP
RUN apk add --no-cache \
    git \
    curl \
    libpng-dev \
    libjpeg-turbo-dev \
    postgresql-dev && \
    docker-php-ext-install pdo_pgsql opcache

# Copia los archivos del proyecto al contenedor
COPY . .

# Instala Composer y sus dependencias
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer
# Usamos "composer install" sin --no-dev para tener las herramientas de desarrollo disponibles
RUN composer install

# Corrige los permisos para que Laravel pueda escribir
RUN chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache \
    && chmod -R 775 /var/www/html/storage /var/www/html/bootstrap/cache

# Expone el puerto por defecto de Laravel
EXPOSE 8000

# Comando para ejecutar el servidor de desarrollo de Laravel al iniciar el contenedor
CMD ["php", "artisan", "serve", "--host=0.0.0.0", "--port=8000"]
