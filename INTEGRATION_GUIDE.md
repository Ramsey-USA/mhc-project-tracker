# MHC Project Tracker - Integration Guide

## Procore Integration

### Overview
The MHC Project Tracker can import data from Procore and sync updates back to maintain consistency between systems.

### Supported Procore Data Types
- **Projects**: Import project details, budgets, and timelines
- **RFIs**: Sync RFI status and responses
- **Submittals**: Import submittal schedules and approvals
- **Change Orders**: Track change order status
- **Daily Logs**: Import T&M data from daily reports

### Setup Instructions
1. Go to Settings → Integrations
2. Click "Connect Procore"
3. Enter your Procore API credentials
4. Select projects to sync
5. Configure sync frequency (daily, weekly, manual)

### Data Mapping
- Procore Projects → MHC Projects
- Procore RFIs → MHC RFI Items  
- Procore Submittals → MHC Submittal Items
- Procore T&M → MHC T&M Tickets

## Outlook Email Integration

### Overview
Automatically create hot ticket items from emails and send status updates to stakeholders.

### Features
- **Email Parsing**: Automatically detect RFIs, submittals, and other items from emails
- **Status Updates**: Send email notifications for item status changes
- **Email Templates**: Pre-configured templates for different item types
- **Contact Sync**: Import contacts from Outlook address book

### Setup Instructions
1. Go to Settings → Email Integration
2. Click "Connect Outlook"
3. Authorize email access
4. Configure email rules and templates
5. Set up automatic parsing keywords

### Email Rules
- Subject contains "RFI" → Create RFI item
- Subject contains "Submittal" → Create Submittal item
- From architect/engineer → High priority
- Keywords: "urgent", "ASAP" → Mark as urgent

## Data Security
- All API credentials are encrypted and stored locally
- No sensitive data is transmitted without encryption
- Integration can be disabled at any time
- Full audit trail of all sync operations
