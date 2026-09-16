FROM php:8.4-cli

RUN apt-get update \
    && apt-get install -y --no-install-recommends git unzip nodejs npm libsqlite3-dev \
    && docker-php-ext-install pdo_sqlite \
    && rm -rf /var/lib/apt/lists/*

COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html

COPY composer.json composer.lock ./
RUN composer install --no-dev --no-interaction --prefer-dist --optimize-autoloader --no-scripts

COPY package.json package-lock.json ./
RUN npm install --no-audit --no-fund

COPY . .
RUN php artisan package:discover --ansi \
    && npm run build \
    && touch database/database.sqlite \
    && mkdir -p storage/framework/cache storage/framework/sessions storage/framework/views bootstrap/cache \
    && chmod -R 775 storage bootstrap/cache

ENV APP_ENV=production
ENV LOG_CHANNEL=stderr
ENV SESSION_DRIVER=cookie
ENV CACHE_STORE=array
ENV QUEUE_CONNECTION=sync

EXPOSE 10000

CMD ["sh", "-c", "if [ ! -f .env ]; then cp .env.example .env; fi; if [ -z \"$APP_KEY\" ]; then php artisan key:generate --force --no-interaction; fi; php artisan serve --host=0.0.0.0 --port=${PORT:-10000}"]
