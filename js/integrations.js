// integrations.js
// Manages integration status and activity

import { selectElement } from './utils.js';
import { getIntegrationStatus, getRecentActivity } from './data.js';

export function initializeIntegrations() {
    console.log('Initializing integrations...');
    updateIntegrationStatus();
    populateIntegrationActivity();
}

export function updateIntegrationStatus() {
    const status = getIntegrationStatus();
    
    // Update Procore status
    updateProcoreStatus(status.procore);
    
    // Update Outlook status
    updateOutlookStatus(status.outlook);
}

function updateProcoreStatus(procoreStatus) {
    const statusElement = selectElement('#procore-status');
    const statsElement = selectElement('#procore-stats');
    const connectBtn = selectElement('#procore-connect-btn');
    const projectsElement = selectElement('#procore-projects');
    const itemsElement = selectElement('#procore-items');
    const lastSyncElement = selectElement('#procore-last-sync');
    
    if (statusElement) {
        statusElement.textContent = procoreStatus.connected ? 'Connected' : 'Not Connected';
        statusElement.className = `integration-status ${procoreStatus.connected ? 'status-connected' : 'status-disconnected'}`;
    }
    
    if (connectBtn) {
        connectBtn.textContent = procoreStatus.connected ? 'Disconnect' : 'Connect';
        connectBtn.className = `btn btn-sm ${procoreStatus.connected ? 'btn-danger' : 'btn-success'}`;
    }
    
    if (statsElement) {
        statsElement.style.display = procoreStatus.connected ? 'flex' : 'none';
    }
    
    if (procoreStatus.connected) {
        if (projectsElement) projectsElement.textContent = procoreStatus.projectsCount;
        if (itemsElement) itemsElement.textContent = procoreStatus.itemsCount;
        if (lastSyncElement) {
            lastSyncElement.textContent = procoreStatus.lastSync 
                ? formatDateTime(procoreStatus.lastSync) 
                : 'Never';
        }
    }
}

function updateOutlookStatus(outlookStatus) {
    const statusElement = selectElement('#outlook-status');
    const statsElement = selectElement('#outlook-stats');
    const connectBtn = selectElement('#outlook-connect-btn');
    const emailsElement = selectElement('#outlook-emails');
    const itemsElement = selectElement('#outlook-items');
    const lastCheckElement = selectElement('#outlook-last-check');
    
    if (statusElement) {
        statusElement.textContent = outlookStatus.connected ? 'Connected' : 'Not Connected';
        statusElement.className = `integration-status ${outlookStatus.connected ? 'status-connected' : 'status-disconnected'}`;
    }
    
    if (connectBtn) {
        connectBtn.textContent = outlookStatus.connected ? 'Disconnect' : 'Connect';
        connectBtn.className = `btn btn-sm ${outlookStatus.connected ? 'btn-danger' : 'btn-success'}`;
    }
    
    if (statsElement) {
        statsElement.style.display = outlookStatus.connected ? 'flex' : 'none';
    }
    
    if (outlookStatus.connected) {
        if (emailsElement) emailsElement.textContent = outlookStatus.emailsProcessed;
        if (itemsElement) itemsElement.textContent = outlookStatus.itemsCreated;
        if (lastCheckElement) {
            lastCheckElement.textContent = outlookStatus.lastCheck 
                ? formatDateTime(outlookStatus.lastCheck) 
                : 'Never';
        }
    }
}

export function populateIntegrationActivity() {
    const activityList = selectElement('#integration-activity-list');
    if (!activityList) return;
    
    const activities = getRecentActivity();
    activityList.innerHTML = '';
    
    if (activities.length === 0) {
        activityList.innerHTML = '<div class="no-activity">No recent integration activity</div>';
        return;
    }
    
    activities.forEach(activity => {
        const activityElement = createActivityElement(activity);
        activityList.appendChild(activityElement);
    });
}

function createActivityElement(activity) {
    const element = document.createElement('div');
    element.className = 'integration-activity-item';
    
    const icon = getActivityIcon(activity.type);
    const timeAgo = getTimeAgo(activity.timestamp);
    
    element.innerHTML = `
        <div class="activity-icon">
            <i class="${icon}"></i>
        </div>
        <div class="activity-content">
            <div class="activity-description">${activity.description}</div>
            <div class="activity-meta">
                <span class="activity-user">${activity.user}</span>
                <span class="activity-project">${activity.project}</span>
                <span class="activity-time">${timeAgo}</span>
            </div>
        </div>
    `;
    
    return element;
}

function getActivityIcon(type) {
    const iconMap = {
        'item_added': 'fas fa-plus',
        'rfi_submitted': 'fas fa-question-circle',
        'submittal_overdue': 'fas fa-exclamation-triangle',
        'sync_completed': 'fas fa-sync',
        'integration_connected': 'fas fa-plug'
    };
    return iconMap[type] || 'fas fa-info';
}

function formatDateTime(dateString) {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true
    });
}

function getTimeAgo(timestamp) {
    const now = new Date();
    const date = new Date(timestamp);
    const diffTime = now - date;
    const diffMinutes = Math.floor(diffTime / (1000 * 60));
    const diffHours = Math.floor(diffMinutes / 60);
    const diffDays = Math.floor(diffHours / 24);
    
    if (diffMinutes < 60) {
        return `${diffMinutes}m ago`;
    } else if (diffHours < 24) {
        return `${diffHours}h ago`;
    } else {
        return `${diffDays}d ago`;
    }
}

export function updateIntegrationActivity(activity) {
    console.log('New integration activity:', activity);
    // This would add new activity to the data and refresh the display
    populateIntegrationActivity();
}
