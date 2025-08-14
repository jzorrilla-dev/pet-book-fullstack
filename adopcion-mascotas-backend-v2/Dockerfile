# Usa una imagen base de PHP con FPM
FROM php:8.2-fpm-alpine

WORKDIR /var/www/html

RUN apk upgrade --no-cache && \
    rm -rf /var/cache/apk/*

RUN apk add --no-cache \
    git \
    curl \
    libpng-dev \
    libjpeg-turbo-dev \
    postgresql-dev && \
    docker-php-ext-install pdo_pgsql opcache

COPY . .

COPY --from=composer:latest /usr/bin/composer /usr/bin/composer
RUN composer install --no-dev --optimize-autoloader

RUN chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache \
    && chmod -R 775 /var/www/html/storage /var/www/html/bootstrap/cache

# Copiamos el entrypoint y lo marcamos como ejecutable
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

EXPOSE 8000

# Usamos formato JSON para evitar el warning
CMD ["/entrypoint.sh"]
