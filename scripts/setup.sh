#!/bin/bash
set -e

echo "======================================"
echo "  CareSmart EC2 Setup Script"
echo "======================================"

# 1. Node.js 18
if command -v node &> /dev/null && [[ "$(node --version)" == v18* ]]; then
  echo "✓ Node.js already installed ($(node --version))"
else
  echo "→ Installing Node.js 18..."
  curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
  sudo apt-get install -y nodejs
  echo "✓ Node.js installed ($(node --version))"
fi

# 2. PM2
if command -v pm2 &> /dev/null; then
  echo "✓ PM2 already installed ($(pm2 --version 2>/dev/null | tail -1))"
else
  echo "→ Installing PM2..."
  sudo npm install -g pm2
  echo "✓ PM2 installed"
fi

# 3. Git
if command -v git &> /dev/null; then
  echo "✓ Git already installed ($(git --version))"
else
  echo "→ Installing Git..."
  sudo apt-get install -y git
  echo "✓ Git installed"
fi

# 4. App directory
mkdir -p /home/ubuntu/caresmart
echo "✓ App directory ready: /home/ubuntu/caresmart"

# 5. Clone repo
if [ -d "/home/ubuntu/caresmart/.git" ]; then
  echo "✓ Repo already cloned"
else
  echo "→ Cloning repository..."
  git clone https://github.com/Pranay44444/CareSmart.git /home/ubuntu/caresmart
  echo "✓ Repo cloned"
fi

# 6. .env file
if [ -f "/home/ubuntu/caresmart/server/.env" ]; then
  echo "✓ .env already exists"
else
  if [ -f "/home/ubuntu/caresmart/server/.env.example" ]; then
    cp /home/ubuntu/caresmart/server/.env.example /home/ubuntu/caresmart/server/.env
    echo "⚠️  .env created from .env.example — please fill in your values:"
    echo "     nano /home/ubuntu/caresmart/server/.env"
  else
    echo "⚠️  No .env.example found. Create .env manually:"
    echo "     nano /home/ubuntu/caresmart/server/.env"
  fi
fi

echo ""
echo "✅ Setup complete!"
echo ""
echo "Next steps:"
echo "  1. Fill in .env:  nano /home/ubuntu/caresmart/server/.env"
echo "  2. Deploy:        bash /home/ubuntu/caresmart/scripts/deploy.sh"
