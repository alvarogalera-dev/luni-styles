#!/bin/bash
set -e

# Aseguramos que estamos en el directorio correcto
cd "$(dirname "$0")"

echo "=========================================="
echo "Iniciando despliegue automático desde GitHub"
echo "Fecha: $(date)"
echo "=========================================="

# Bajar últimos cambios y resguardar BBDD
echo "-> 1/5 Guardando BBDD y actualizando código..."
cp database/database.sqlite database/database.sqlite.bak || true
git stash
git pull origin main
mv database/database.sqlite.bak database/database.sqlite || true

# Cargar Node/NPM (Ajuste para CloudPanel)
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
# Alternativamente, si Node está globalmente:
export PATH="/usr/local/bin:$PATH"

# Instalar dependencias PHP
echo "-> 2/5 Instalando dependencias PHP..."
composer install --no-interaction --prefer-dist --optimize-autoloader

# Migraciones
echo "-> 3/5 Ejecutando migraciones..."
php artisan migrate --force

# Instalar dependencias Node y compilar React/Inertia
echo "-> 4/5 Construyendo frontend (Vite)..."
npm install
npm run build

# Limpiar y cachear configuraciones
echo "-> 5/5 Limpiando y regenerando caché de Laravel..."
php artisan optimize:clear
php artisan config:cache
php artisan route:cache
php artisan view:cache

echo "=========================================="
echo "Despliegue finalizado con éxito."
echo "Fecha: $(date)"
echo "=========================================="
