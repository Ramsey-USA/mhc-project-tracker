#!/bin/bash
# MHC Project Tracker - Linux/Mac Deployment Script

echo "================================================"
echo "MHC Project Tracker - Deployment Assistant"
echo "================================================"
echo

# Check if we're in the right directory
if [ ! -f "index.html" ]; then
    echo "❌ ERROR: index.html not found!"
    echo "Please run this script from the project directory."
    exit 1
fi

echo "Found required files:"
[ -f "index.html" ] && echo "✓ index.html"
[ -f "script.js" ] && echo "✓ script.js"
[ -f "styles.css" ] && echo "✓ styles.css"
[ -f "README.md" ] && echo "✓ README.md"
echo

echo "Choose deployment option:"
echo "1. Copy to Apache web directory (/var/www/html/mhc-tracker/)"
echo "2. Copy to custom directory"
echo "3. Create deployment package (tar.gz)"
echo "4. Open GitHub Pages setup"
echo

read -p "Enter your choice (1-4): " choice

case $choice in
    1)
        echo
        echo "Deploying to Apache..."
        target="/var/www/html/mhc-tracker"
        sudo mkdir -p "$target"
        sudo cp index.html "$target/"
        sudo cp script.js "$target/"
        sudo cp styles.css "$target/"
        sudo cp README.md "$target/"
        sudo chmod 644 "$target"/*
        sudo chown -R www-data:www-data "$target" 2>/dev/null || true
        echo
        echo "✓ Deployment complete!"
        echo "Your app should be available at: http://your-server/mhc-tracker/"
        ;;
    2)
        echo
        read -p "Enter target directory path: " target
        mkdir -p "$target"
        cp index.html "$target/"
        cp script.js "$target/"
        cp styles.css "$target/"
        cp README.md "$target/"
        echo
        echo "✓ Files copied to: $target"
        ;;
    3)
        echo
        echo "Creating deployment package..."
        tar -czf MHC-Tracker-Deploy.tar.gz index.html script.js styles.css README.md DEPLOYMENT.md
        echo "✓ Created: MHC-Tracker-Deploy.tar.gz"
        echo "You can now upload this file to your server and extract it."
        ;;
    4)
        echo
        echo "Opening GitHub Pages setup..."
        if command -v xdg-open &> /dev/null; then
            xdg-open "https://github.com/Ramsey-USA/mhc-project-tracker/settings/pages"
        elif command -v open &> /dev/null; then
            open "https://github.com/Ramsey-USA/mhc-project-tracker/settings/pages"
        else
            echo "Please open this URL in your browser:"
            echo "https://github.com/Ramsey-USA/mhc-project-tracker/settings/pages"
        fi
        echo "Follow the instructions in your browser to enable GitHub Pages."
        ;;
    *)
        echo "❌ Invalid choice. Please run the script again."
        exit 1
        ;;
esac
