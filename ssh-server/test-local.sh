#!/bin/bash

# Quick local testing script for SSH contact form
# This script helps you test the entire flow locally

set -e

echo "╔═══════════════════════════════════════════════════════════════╗"
echo "║                                                               ║"
echo "║   pcstyle.dev SSH Contact Form - Local Test                  ║"
echo "║                                                               ║"
echo "╚═══════════════════════════════════════════════════════════════╝"
echo ""

# check if .env exists
if [ ! -f .env ]; then
    echo "warning: no .env file found. creating from .env.example..."
    cp .env.example .env
    echo "ok created .env file"
    echo ""
    echo "warning: please edit .env and set API_URL to your local Next.js server"
    echo "   example: API_URL=http://localhost:3000/api/contact"
    echo ""
    read -p "press Enter to continue after editing .env..."
fi

# check if node_modules exists
if [ ! -d node_modules ]; then
    echo "installing dependencies..."
    npm install
    echo "ok dependencies installed"
    echo ""
fi

# generate host key if it doesn't exist
if [ ! -f host.key ]; then
    echo "generating ssh host key..."
    ssh-keygen -t rsa -b 4096 -f host.key -N ""
    echo "ok host key generated"
    echo ""
fi

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "starting ssh server on port 2222..."
echo ""
echo "to test:"
echo "  1. open another terminal"
echo "  2. run: ssh -p 2222 localhost"
echo "  3. fill out the form"
echo "  4. check your discord channel for the message"
echo ""
echo "press Ctrl+C to stop the server"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# start the server
npm start
