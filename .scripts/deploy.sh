#!/bin/bash
set -e

echo "Deployment started..."

# Pull the latest version of the app
git pull origin main
echo "New changes copied to server !"

echo "Installing Dependencies..."
npm install --yes

echo "Creating Production Build..."
# Build directly to /var/www/auth/dist
npx vite build --outDir /var/www/html/dist

echo "Deployment Finished!"