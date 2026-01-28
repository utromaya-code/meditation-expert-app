#!/bin/bash
cd "/Users/poslednijgeroj/Library/Mobile Documents/com~apple~CloudDocs/meditation-expert-app"
export PATH="$HOME/node/bin:$PATH"
export EXPO_NO_DOTENV=1
export EXPO_NO_GIT_STATUS=1

echo "🚀 Запуск Expo..."
echo "📱 IP адрес: 192.168.31.196"
echo "📱 URL: exp://192.168.31.196:8081"
echo ""
echo "💡 Откройте QR-код в файле qr-code.html"
echo ""

npx expo start --port 8081
