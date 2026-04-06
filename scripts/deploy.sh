#!/bin/bash
set -e

echo "======================================"
echo "  CareSmart Deploy Script"
echo "======================================"

# 1. Pull latest code
echo "→ Pulling latest code..."
cd /home/ubuntu/caresmart
git pull origin main
echo "✓ Code updated"

# 2. Install server dependencies
echo "→ Installing server dependencies..."
cd /home/ubuntu/caresmart/server
npm install --production
echo "✓ Dependencies installed"

# 3. Restart or start PM2 process
echo "→ Restarting server with PM2..."
if pm2 describe caresmart-backend > /dev/null 2>&1; then
  pm2 restart caresmart-backend
  echo "✓ PM2 process restarted"
else
  pm2 start /home/ubuntu/caresmart/server/src/index.js --name caresmart-backend
  echo "✓ PM2 process started"
fi

# 4. Save PM2 process list
pm2 save
echo "✓ PM2 process list saved"

echo ""
echo "✅ Deploy complete! App running on port 5001"
