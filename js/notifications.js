// notifications.js
// Manages notifications in the dashboard

import { selectElement } from './utils.js';

export function showNotification(message, type = 'info') {
    const notification = selectElement('#notification');
    const notificationMessage = selectElement('#notification-message');

    notificationMessage.textContent = message;
    notification.className = `notification ${type}`;
    notification.style.display = 'block';

    setTimeout(() => {
        notification.style.display = 'none';
    }, 5000);
}

export function initializeNotifications() {
    console.log('Initializing notifications...');
    // Add logic to initialize notifications
}
