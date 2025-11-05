#!/bin/bash

# Quick local testing script for SSH contact form
# This script helps you test the entire flow locally

set -e

echo "╔═══════════════════════════════════════════════════════════════╗"
echo "║                                                               ║"
echo "║   🧪 pcstyle.dev SSH Contact Form - Local Test               ║"
echo "║                                                               ║"
echo "╚═══════════════════════════════════════════════════════════════╝"
echo ""

# Check if .env exists
if [ ! -f .env ]; then
    echo "⚠️  No .env file found. Creating from .env.example..."
    cp .env.example .env
    echo "✓ Created .env file"
    echo ""
    echo "⚠️  Please edit .env and set API_URL to your local Next.js server"
    echo "   Example: API_URL=http://localhost:3000/api/contact"
    echo ""
    read -p "Press Enter to continue after editing .env..."
fi

# Check if node_modules exists
if [ ! -d node_modules ]; then
    echo "📦 Installing dependencies..."
    npm install
    echo "✓ Dependencies installed"
    echo ""
fi

# Generate host key if it doesn't exist
if [ ! -f host.key ]; then
    echo "🔐 Generating SSH host key..."
    ssh-keygen -t rsa -b 4096 -f host.key -N ""
    echo "✓ Host key generated"
    echo ""
fi

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "🚀 Starting SSH server on port 2222..."
echo ""
echo "To test:"
echo "  1. Open another terminal"
echo "  2. Run: ssh -p 2222 localhost"
echo "  3. Fill out the form"
echo "  4. Check your Discord channel for the message"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Start the server
npm start
