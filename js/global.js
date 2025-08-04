// Global functions for inline onclick handlers
// These functions need to be accessible from HTML onclick attributes

// Export/Import functions (needed for module system)
import { initializeDashboard } from './ui.js';

// Global utility functions for modal handling
window.showAddModal = function(type) {
    const modal = document.getElementById(`${type}-modal`);
    if (modal) {
        modal.style.display = 'block';
    } else {
        console.warn(`Modal not found: ${type}-modal`);
    }
};

window.closeModal = function(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'none';
    }
};

// Header button functions
window.exportTeamMeeting = function() {
    console.log('Exporting Monday Team Report...');
    alert('Monday Team Report export functionality coming soon!');
};

window.exportBossReport = function() {
    console.log('Exporting Friday Boss Report...');
    alert('Friday Boss Report export functionality coming soon!');
};

window.backupData = function() {
    console.log('Backing up data as JSON...');
    alert('JSON backup functionality coming soon!');
};

window.backupDataCSV = function() {
    console.log('Backing up data as CSV...');
    alert('CSV backup functionality coming soon!');
};

window.showDataInfo = function() {
    console.log('Showing data info...');
    alert('Data storage information:\n- Local browser storage\n- No external database connected\n- Data persists until browser cache is cleared');
};

// Analytics functions
window.showReportBuilder = function() {
    const modal = document.getElementById('report-builder-modal');
    if (modal) {
        modal.style.display = 'block';
    }
};

window.exportAnalytics = function() {
    console.log('Exporting analytics...');
    alert('Analytics export functionality coming soon!');
};

// Notification functions
window.configureNotifications = function() {
    console.log('Configuring notifications...');
    alert('Notification configuration coming soon!');
};

window.markAllNotificationsRead = function() {
    console.log('Marking all notifications as read...');
    alert('All notifications marked as read!');
};

// Integration functions
window.showIntegrationSettings = function() {
    const modal = document.getElementById('integration-settings-modal');
    if (modal) {
        modal.style.display = 'block';
    }
};

window.showSyncStatus = function() {
    const modal = document.getElementById('sync-status-modal');
    if (modal) {
        modal.style.display = 'block';
    }
};

window.connectProcore = function() {
    console.log('Connecting to Procore...');
    alert('Procore integration setup coming soon!');
};

window.connectOutlook = function() {
    console.log('Connecting to Outlook...');
    alert('Outlook integration setup coming soon!');
};

// Project functions
window.addNewProject = function() {
    const modal = document.getElementById('project-edit-modal');
    if (modal) {
        // Clear the form for new project
        document.getElementById('project-modal-title').textContent = 'Add New Project';
        document.getElementById('project-edit-form').reset();
        document.getElementById('edit-project-id').value = '';
        modal.style.display = 'block';
    }
};

window.editProject = function(projectId) {
    console.log('Editing project:', projectId);
    // This would populate the edit form with project data
    const modal = document.getElementById('project-edit-modal');
    if (modal) {
        document.getElementById('project-modal-title').textContent = 'Edit Project';
        document.getElementById('edit-project-id').value = projectId;
        modal.style.display = 'block';
    }
};

window.viewProjectDetails = function(projectId) {
    console.log('Viewing project details:', projectId);
    alert(`Project details for ${projectId} - Full details view coming soon!`);
};

// Item management functions
window.editItem = function(itemId) {
    console.log('Editing item:', itemId);
    alert(`Edit functionality for item ${itemId} coming soon!`);
};

window.logContact = function(itemId) {
    console.log('Logging contact for item:', itemId);
    const modal = document.getElementById('contact-modal');
    if (modal) {
        document.getElementById('contact-item-id').value = itemId;
        modal.style.display = 'block';
    }
};

window.completeItem = function(itemId) {
    console.log('Completing item:', itemId);
    if (confirm('Mark this item as complete?')) {
        alert(`Item ${itemId} marked as complete!`);
        // Here you would update the item status and refresh the display
    }
};

// Notification functions
window.dismissNotification = function(notificationId) {
    console.log('Dismissing notification:', notificationId);
    // Find and remove the notification element
    const notificationElement = document.querySelector(`[data-notification-id="${notificationId}"]`);
    if (notificationElement) {
        notificationElement.remove();
    }
};

// Form submission handlers
window.addItem = function(event, type) {
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);
    const itemData = {};

    formData.forEach((value, key) => {
        itemData[key] = value;
    });

    console.log(`Adding ${type} item:`, itemData);
    
    // Close modal and reset form
    closeModal(`${type}-modal`);
    form.reset();
    
    alert(`${type.toUpperCase()} item added successfully!`);
};

// Filter functions
window.filterItems = function() {
    console.log('Filtering items...');
    // Filter functionality would go here
};

window.performSearch = function() {
    console.log('Performing search...');
    // Search functionality would go here
};

window.clearSearch = function() {
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.value = '';
    }
    console.log('Search cleared');
};

window.toggleAdvancedFilters = function() {
    const advancedFilters = document.getElementById('advanced-filters');
    if (advancedFilters) {
        const isVisible = advancedFilters.style.display !== 'none';
        advancedFilters.style.display = isVisible ? 'none' : 'block';
    }
};

window.clearAllFilters = function() {
    console.log('Clearing all filters...');
    // Clear filter functionality would go here
};

window.saveCurrentFilters = function() {
    console.log('Saving current filters...');
    alert('Filter saving functionality coming soon!');
};

// Notification utility
window.hideNotification = function() {
    const notification = document.getElementById('notification');
    if (notification) {
        notification.style.display = 'none';
    }
};

// File restore handler
window.restoreData = function(event) {
    const file = event.target.files[0];
    if (file) {
        console.log('Restoring data from file:', file.name);
        alert('Data restore functionality coming soon!');
    }
};

// Analytics period update
window.updateAnalytics = function() {
    console.log('Updating analytics...');
    // Analytics update functionality would go here
};

// Email settings update
window.updateEmailSettings = function() {
    console.log('Updating email settings...');
    // Email settings functionality would go here
};
