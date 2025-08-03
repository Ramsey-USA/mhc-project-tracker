#!/bin/bash
# MHC Project Tracker - Local Setup Script

echo "🏗️  MHC Project Tracker - Local Setup"
echo "======================================"

# Check if we're in the right directory
if [ ! -f "index.html" ]; then
    echo "❌ Error: index.html not found. Please run this script from the project directory."
    exit 1
fi

echo "✅ Found project files"

# Function to start server
start_server() {
    echo ""
    echo "🚀 Starting local server..."
    echo "📱 Your application will be available at: http://localhost:8000"
    echo "🛑 Press Ctrl+C to stop the server"
    echo ""
    
    # Try different server options
    if command -v python3 &> /dev/null; then
        echo "Using Python 3..."
        python3 -m http.server 8000
    elif command -v python &> /dev/null; then
        echo "Using Python..."
        python -m http.server 8000
    elif command -v php &> /dev/null; then
        echo "Using PHP..."
        php -S localhost:8000
    elif command -v npx &> /dev/null; then
        echo "Using Node.js..."
        npx http-server -p 8000
    else
        echo "❌ No suitable server found. Please install Python, PHP, or Node.js"
        echo "💡 Alternatively, you can double-click index.html to open it directly"
        exit 1
    fi
}

# Check if user wants to start server
echo "Choose an option:"
echo "1) Start local server (recommended)"
echo "2) Just open in browser (simple method)"
echo ""
read -p "Enter your choice (1 or 2): " choice

case $choice in
    1)
        start_server
        ;;
    2)
        echo "📂 Opening index.html in your default browser..."
        if command -v xdg-open &> /dev/null; then
            xdg-open index.html
        elif command -v open &> /dev/null; then
            open index.html
        elif command -v start &> /dev/null; then
            start index.html
        else
            echo "💡 Please manually double-click index.html to open it"
        fi
        ;;
    *)
        echo "❌ Invalid choice. Please run the script again."
        ;;
esac
