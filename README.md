# MHC Project Tracker

A simplified construction project management dashboard designed specifically for project engineers managing multiple construction jobs. Track T&M tickets, lien releases, pay applications, RFIs, and submittals across all projects with automated Excel reporting.

## 🎯 Purpose

This tool is designed for project engineers who need to:
- Track "Hot Ticket Items" across multiple construction projects
- Stay ahead of critical deadlines and prevent items from falling through the cracks
- Generate professional Excel reports for management and team meetings
- Maintain visibility across all projects managed by different PMs

## 🏗️ Features

### Core Tracking
- **T&M Tickets**: Employee hours, materials, tools, payment status
- **Lien Releases**: Conditional/unconditional releases with expiration tracking
- **Pay Applications**: Amount, approval status, ball in court tracking
- **RFIs**: Request tracking with architect/owner/MHC responsibility
- **Submittals**: Review status and approval workflow

### Dashboard Features
- **Color-coded alerts**: Red (24hrs to overdue), visual status indicators
- **Quick entry forms**: 30-second data entry matching Procore style
- **Search and filtering**: Find items by PM, type, status, or keywords
- **Contact logging**: Track email, text, phone, in-person communications
- **Priority flagging**: Mark critical items requiring immediate attention

### Excel Reports
- **Monday Team Meeting Report**: Organized by PM (Makayla, Ben, Jeremy)
- **Friday Boss Report**: Organized by job with executive summary
- **Comprehensive data**: All hot ticket items with full details

### Data Management
- **Local storage**: Data stays on your computer for privacy
- **Backup/restore**: Save and restore your data easily
- **No server required**: Runs entirely in your browser

## 🚀 Quick Start

### Option 1: GitHub Pages (Recommended)
1. Fork this repository to your GitHub account
2. Go to Settings → Pages
3. Select "Deploy from a branch" → "main" → "/ (root)"
4. Your dashboard will be available at `https://yourusername.github.io/mhc-project-tracker`

### Option 2: Local Use
1. Download all files to your computer
2. Double-click `index.html` to open in your browser
3. Bookmark the page for easy access

## 📊 Daily Workflow

### Morning Routine (2 minutes )
1. Open dashboard bookmark
2. Check red/yellow alerts for urgent items
3. Review what's due today

### Throughout the Day (30 seconds per item)
1. Get email/call about T&M, lien release, etc.
2. Click appropriate "Add" button
3. Fill out quick form
4. Save and continue

### End of Day
1. Click "Send Daily Reports" to generate status emails
2. Review tomorrow's due items

### Weekly Reports
- **Monday**: Export team meeting report for distribution
- **Friday**: Export boss report for management review

## 🏢 Project Structure

The tracker is set up for MHC Construction with:
- **Makayla**: 2 projects (Office Complex, Retail Center)
- **Ben**: 3 projects (Warehouse Expansion, Manufacturing Plant, Distribution Center)  
- **Jeremy**: 1 project (Darigold Plant)

You can easily modify the project list in the JavaScript file to match your actual projects.

## 💾 Data Storage

- All data is stored locally in your browser
- No data is sent to external servers
- Use the backup feature regularly to save your data
- Data persists between browser sessions

## 🔧 Customization

### Adding New Projects
Edit the `projects` array in `script.js`:
```javascript
projects = [
    {
        id: 'new-project-id',
        name: 'New Project Name',
        pm: 'PM Name',
        status: 'active',
        startDate: '2024-01-01',
        endDate: '2024-12-31'
    }
];
