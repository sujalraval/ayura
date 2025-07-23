#!/bin/bash
set -e

echo "Deployment started..."

# Pull the latest version of the app
git pull origin main
echo "New changes copied to server !"

echo "Installing Dependencies..."
/usr/bin/npm install --yes

echo "Creating Production Build..."
/usr/bin/npx vite build --outDir /var/www/html/dist

echo "Deployment Finished!"
