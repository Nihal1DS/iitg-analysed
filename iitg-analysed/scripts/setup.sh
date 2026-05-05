#!/usr/bin/env bash
# First-time setup script for IITG Analysed
set -e

echo "🎓 Setting up IITG Analysed..."

# Check Node version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 20 ]; then
  echo "❌ Node.js 20+ is required. Install from https://nodejs.org"
  exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Copy env file
if [ ! -f .env ]; then
  cp .env.example .env
  echo "✅ Created .env from .env.example — edit it to add your API keys"
fi

echo ""
echo "✅ Setup complete!"
echo ""
echo "Start the dashboard:"
echo "  npm run dev"
echo ""
echo "To enable AI briefs, install Ollama: https://ollama.com"
echo "Then run: ollama pull llama3.2"
