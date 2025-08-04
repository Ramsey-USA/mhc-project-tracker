// script.js
// Main entry point for initializing the dashboard

import { initializeDashboard } from './js/ui.js';
import { initializeCharts } from './js/charts.js';
import { initializeNotifications } from './js/notifications.js';
import { initializeIntegrations } from './js/integrations.js';
import { initializeProjects } from './js/projects.js';
import { initializeFilters } from './js/filters.js';
import { initializeReportBuilder } from './js/reportBuilder.js';
import { initializeSyncStatus } from './js/syncStatus.js';
import './js/global.js'; // Import global functions for onclick handlers

document.addEventListener('DOMContentLoaded', () => {
    console.log('Initializing MHC Project Tracker Dashboard...');

    // Initialize all modules
    initializeDashboard();
    initializeCharts();
    initializeNotifications();
    initializeIntegrations();
    initializeProjects();
    initializeFilters();
    initializeReportBuilder();
    initializeSyncStatus();

    console.log('Dashboard initialized successfully.');
});
