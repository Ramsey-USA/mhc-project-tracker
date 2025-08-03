@echo off
REM MHC Project Tracker - Windows Deployment Script
REM This script helps deploy the application to a Windows server

echo ================================================
echo MHC Project Tracker - Deployment Assistant
echo ================================================
echo.

REM Check if we're in the right directory
if not exist "index.html" (
    echo ERROR: index.html not found!
    echo Please run this script from the project directory.
    pause
    exit /b 1
)

echo Found required files:
if exist "index.html" echo ✓ index.html
if exist "script.js" echo ✓ script.js  
if exist "styles.css" echo ✓ styles.css
if exist "README.md" echo ✓ README.md
echo.

echo Choose deployment option:
echo 1. Copy to IIS web directory (C:\inetpub\wwwroot\mhc-tracker\)
echo 2. Copy to custom directory
echo 3. Create deployment package (ZIP file)
echo 4. Open GitHub Pages setup
echo.

set /p choice="Enter your choice (1-4): "

if "%choice%"=="1" goto iis_deploy
if "%choice%"=="2" goto custom_deploy  
if "%choice%"=="3" goto create_package
if "%choice%"=="4" goto github_pages

echo Invalid choice. Please run the script again.
pause
exit /b 1

:iis_deploy
echo.
echo Deploying to IIS...
set target=C:\inetpub\wwwroot\mhc-tracker
if not exist "%target%" mkdir "%target%"
copy "index.html" "%target%\"
copy "script.js" "%target%\"
copy "styles.css" "%target%\"
copy "README.md" "%target%\"
echo.
echo ✓ Deployment complete!
echo Your app should be available at: http://localhost/mhc-tracker/
pause
exit /b 0

:custom_deploy
echo.
set /p target="Enter target directory path: "
if not exist "%target%" mkdir "%target%"
copy "index.html" "%target%\"
copy "script.js" "%target%\"
copy "styles.css" "%target%\"
copy "README.md" "%target%\"
echo.
echo ✓ Files copied to: %target%
pause
exit /b 0

:create_package
echo.
echo Creating deployment package...
powershell -command "Compress-Archive -Path 'index.html','script.js','styles.css','README.md','DEPLOYMENT.md' -DestinationPath 'MHC-Tracker-Deploy.zip' -Force"
echo ✓ Created: MHC-Tracker-Deploy.zip
echo You can now upload this file to your server and extract it.
pause
exit /b 0

:github_pages
echo.
echo Opening GitHub Pages setup...
start https://github.com/Ramsey-USA/mhc-project-tracker/settings/pages
echo Follow the instructions in your browser to enable GitHub Pages.
pause
exit /b 0
