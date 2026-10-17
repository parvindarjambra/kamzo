#!/bin/bash
# ==============================================
# KAMZO Admin Panel - Hostinger VPS Deploy Script
# Run this on your Hostinger VPS after SSH login
# ==============================================

echo "🇵🇰 KAMZO Admin Panel - Hostinger Deployment"
echo "============================================="

# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 20 LTS
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2 (process manager - keeps app running 24/7)
sudo npm install -g pm2

# Install Nginx (reverse proxy)
sudo apt install -y nginx

# Create app directory
sudo mkdir -p /var/www/kamzo-admin
sudo chown $USER:$USER /var/www/kamzo-admin

echo "✅ System setup complete"
echo "Next: Upload your kamzo_admin/.next/standalone folder to /var/www/kamzo-admin/"
