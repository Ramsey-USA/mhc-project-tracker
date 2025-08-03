# MHC Project Tracker - Deployment Guide

## Quick Deployment Checklist

### Required Files
- ✅ index.html (main application)
- ✅ script.js (application logic)
- ✅ styles.css (styling)
- ✅ README.md (documentation)

### Dependencies (Loaded from CDN)
- Font Awesome Icons: https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css
- XLSX Library: https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js

## Deployment Options

### 1. GitHub Pages (Recommended)
1. Go to: https://github.com/Ramsey-USA/mhc-project-tracker/settings/pages
2. Select "Deploy from a branch"
3. Choose "main" branch
4. Your app will be at: https://ramsey-usa.github.io/mhc-project-tracker/

### 2. Company Web Server
Upload all files to your web server directory:
- Windows IIS: C:\inetpub\wwwroot\mhc-tracker\
- Linux Apache: /var/www/html/mhc-tracker/

### 3. Network Share
Copy files to shared network location:
\\company-server\shared\MHC-Tracker\

## Server Requirements
- ✅ Static file serving (HTML, CSS, JS)
- ✅ Internet access for CDN resources
- ❌ No database required
- ❌ No server-side processing required
- ❌ No special software installation needed

## Access Requirements
- Modern web browser (Chrome, Firefox, Safari, Edge)
- JavaScript enabled
- Internet access for icons and Excel export

## Security Considerations
- All data stored locally in browser
- No sensitive data transmitted to external servers
- HTTPS recommended for production use
- Consider access controls based on company policy

## Maintenance
- Regular backups using built-in backup feature
- Updates via GitHub repository
- No server maintenance required

## Support
For technical issues, contact your IT department or refer to the README.md file.
