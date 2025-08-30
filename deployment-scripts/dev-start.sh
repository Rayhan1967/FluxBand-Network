#!/bin/bash

echo "🚀 Starting FluxBand Network Development Environment"
echo "===================================================="

# Start PostgreSQL
sudo systemctl start postgresql 2>/dev/null || echo "PostgreSQL not available"

# Start Redis
sudo systemctl start redis 2>/dev/null || echo "Redis not available"

echo "📦 Installing all dependencies..."
npm run install:all

echo "🖥️  Opening development terminals..."

# Start each service in separate terminal tabs
if command -v gnome-terminal >/dev/null 2>&1; then
    gnome-terminal --tab --title="📋 Smart Contracts" -- bash -c "cd smart-contracts && npm run compile && npx hardhat node"
    gnome-terminal --tab --title="🌐 API Backend" -- bash -c "cd api-backend && npm run dev"
    gnome-terminal --tab --title="🔌 Browser Extension" -- bash -c "cd browser-extension && npm run dev"
    gnome-terminal --tab --title="📊 Web Dashboard" -- bash -c "cd web-dashboard && npm run dev"
    
    echo "✅ All services started in separate terminals!"
else
    echo "💡 Manual commands:"
    echo "   Contracts: cd smart-contracts && npx hardhat node"
    echo "   Backend:   cd api-backend && npm run dev"
    echo "   Extension: cd browser-extension && npm run dev"
    echo "   Dashboard: cd web-dashboard && npm run dev"
fi

echo "🎯 FluxBand Network ready for development!"
