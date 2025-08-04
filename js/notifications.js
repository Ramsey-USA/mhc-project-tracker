// notifications.js
// Manages notifications in the dashboard

import { selectElement } from './utils.js';
import { getNotificationsData } from './data.js';

export function showNotification(message, type = 'info') {
    const notification = selectElement('#notification');
    const notificationMessage = selectElement('#notification-message');

    if (notification && notificationMessage) {
        notificationMessage.textContent = message;
        notification.className = `notification ${type}`;
        notification.style.display = 'block';

        setTimeout(() => {
            notification.style.display = 'none';
        }, 5000);
    }
}

export function initializeNotifications() {
    console.log('Initializing notifications...');
    populateNotifications();
}

export function populateNotifications() {
    const notifications = getNotificationsData();
    
    // Populate urgent notifications
    populateNotificationSection('urgent-notifications-list', 'urgent-notification-count', notifications.urgent);
    
    // Populate overdue notifications
    populateNotificationSection('overdue-notifications-list', 'overdue-notification-count', notifications.overdue);
    
    // Populate milestone notifications
    populateNotificationSection('milestone-notifications-list', 'milestone-notification-count', notifications.milestones);
}

function populateNotificationSection(listId, countId, notifications) {
    const listElement = selectElement(`#${listId}`);
    const countElement = selectElement(`#${countId}`);
    
    if (!listElement) return;
    
    // Update count
    if (countElement) {
        countElement.textContent = notifications.length;
    }
    
    // Clear existing content
    listElement.innerHTML = '';
    
    if (notifications.length === 0) {
        listElement.innerHTML = '<div class="no-notifications">No notifications</div>';
        return;
    }
    
    notifications.forEach(notification => {
        const notificationElement = createNotificationElement(notification);
        listElement.appendChild(notificationElement);
    });
}

function createNotificationElement(notification) {
    const element = document.createElement('div');
    element.className = `notification-item notification-${notification.type}`;
    
    const icon = getNotificationIcon(notification.type);
    const timeAgo = notification.dueDate ? getTimeUntilDue(notification.dueDate) : '';
    
    element.innerHTML = `
        <div class="notification-icon">
            <i class="${icon}"></i>
        </div>
        <div class="notification-content">
            <div class="notification-title">${notification.title}</div>
            <div class="notification-message">${notification.message}</div>
            <div class="notification-meta">
                <span class="notification-project">${notification.project || ''}</span>
                ${timeAgo ? `<span class="notification-time">${timeAgo}</span>` : ''}
            </div>
        </div>
        <div class="notification-actions">
            <button class="btn btn-sm btn-secondary" onclick="dismissNotification('${notification.id}')">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
    
    return element;
}

function getNotificationIcon(type) {
    const iconMap = {
        'urgent': 'fas fa-exclamation-triangle',
        'overdue': 'fas fa-clock',
        'milestone': 'fas fa-flag'
    };
    return iconMap[type] || 'fas fa-bell';
}

function getTimeUntilDue(dueDateString) {
    const dueDate = new Date(dueDateString);
    const now = new Date();
    const diffTime = dueDate - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) {
        return `${Math.abs(diffDays)} days overdue`;
    } else if (diffDays === 0) {
        return 'Due today';
    } else if (diffDays === 1) {
        return 'Due tomorrow';
    } else {
        return `Due in ${diffDays} days`;
    }
}
