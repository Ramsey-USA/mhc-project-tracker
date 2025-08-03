# MHC Project Tracker - Data Management Guide

## Overview
Your MHC Project Tracker uses **local browser storage** for day-to-day operations but provides multiple ways to backup and save your data to your PC and company server.

## How Data Storage Works

### Local Storage (Browser)
- Data is automatically saved to your browser's localStorage
- Persists between browser sessions on the same computer
- Only available on that specific browser/computer
- **Important**: Clear browser data = lost data (unless backed up)

### Backup Options Available

#### 1. JSON Backup (Complete Data)
- **Button**: "Backup JSON" 
- **What it does**: Downloads complete database as `MHC_Backup_YYYY-MM-DD.json`
- **Contains**: All items, projects, contact logs, metadata
- **Use for**: Complete system backup/restore
- **File size**: Small (typically <1MB)

#### 2. CSV Backup (Data Export)
- **Button**: "Backup CSV"
- **What it does**: Downloads data as `MHC_Data_YYYY-MM-DD.csv`
- **Contains**: All hot ticket items in spreadsheet format
- **Use for**: Analysis in Excel, sharing data, reporting
- **File size**: Very small

#### 3. Excel Reports (Weekly Reports)
- **Monday Team Report**: Current active items for team meetings
- **Friday Boss Report**: Summary for management review

## Recommended Data Management Workflow

### Daily Usage
1. Use the application normally in your browser
2. Data automatically saves locally

### Weekly Backup (Recommended)
1. Click "Backup JSON" every Friday
2. Save the file to:
   - Your PC: `Documents/MHC_Backups/`
   - Company Server: `\\server\shared\MHC_Backups\`

### Monthly Archive
1. Click "Backup CSV" at month-end
2. Save to company server for historical records
3. Can be opened in Excel for analysis

## Saving to Company Server

### Method 1: Manual Copy
```
1. Click "Backup JSON" or "Backup CSV"
2. File downloads to your Downloads folder
3. Copy file to company server location:
   - Network drive: \\server\shared\MHC_Backups\
   - SharePoint: Upload to document library
   - Cloud storage: Google Drive, OneDrive, etc.
```

### Method 2: Automated Backup Script
```
1. Create a folder: C:\MHC_Backups\
2. Download backups to this folder
3. Set up Windows Task Scheduler to copy files to server
4. Or use robocopy command in batch file
```

### Method 3: Cloud Sync
```
1. Download backups to a synced folder:
   - OneDrive folder
   - Google Drive folder
   - Dropbox folder
2. Files automatically sync to company cloud storage
```

## Restoring Data

### From JSON Backup
1. Click "Restore Data" button
2. Select your `.json` backup file
3. All data will be restored and browser updated

### Moving Between Computers
1. Export data from old computer (JSON backup)
2. Open application on new computer
3. Use "Restore Data" to import your backup

## Data Security Tips

### Regular Backups
- Weekly JSON backups (minimum)
- Store backups in 2+ locations (PC + Server)
- Test restore process monthly

### File Organization
```
Suggested folder structure:
MHC_Backups/
├── 2024/
│   ├── January/
│   ├── February/
│   └── ...
├── 2025/
│   ├── January/
│   └── February/
```

### Version Control
- JSON files include timestamp and version info
- Keep last 3-4 backups for safety
- Archive older backups annually

## Company Server Integration Examples

### Windows File Server
```
Network path: \\company-server\shared\MHC_Backups\
Access: Map network drive or UNC path
Permissions: Read/Write for MHC team
```

### SharePoint
```
1. Create "MHC Project Tracker" document library
2. Create folders by year/month
3. Upload backup files
4. Set permissions for team access
```

### Google Workspace
```
1. Create shared Google Drive folder
2. Give team access
3. Upload backup files
4. Use Google Drive sync for automatic backup
```

## Troubleshooting

### Browser Data Lost
- Use "Restore Data" with latest JSON backup
- All data will be recovered

### Need Older Version
- Navigate to backup folder
- Find backup file from desired date
- Restore using that file

### Sharing Data with Team
- Use CSV backup for Excel sharing
- Use JSON backup for complete system transfer
- Email or share via company server

## Advanced: Automated Company Server Backup

If your IT department can help, create a simple script:

### Windows Batch File (save as MHC_Backup.bat)
```batch
@echo off
set SOURCE=C:\Users\%USERNAME%\Downloads\MHC_Backup_*.json
set DEST=\\company-server\shared\MHC_Backups\%DATE:~-4%\
xcopy "%SOURCE%" "%DEST%" /Y /I
echo Backup copied to company server
```

### PowerShell Script
```powershell
$source = "$env:USERPROFILE\Downloads\MHC_Backup_*.json"
$dest = "\\company-server\shared\MHC_Backups\$(Get-Date -Format yyyy)\"
Copy-Item $source $dest -Force
Write-Host "Backup synced to company server"
```

## Summary

✅ **Yes, you can save data to both PC and company server!**

- Use Option 2 (local browser) for daily work
- Regular JSON backups for complete data safety  
- CSV exports for Excel analysis and sharing
- Simple file copy to save anywhere you need
- No special server setup required - just file storage

The application gives you complete control over your data while being simple to use locally in your browser.
