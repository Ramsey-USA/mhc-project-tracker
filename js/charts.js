// charts.js
// Handles the creation and updating of charts in the dashboard

import { selectElement } from './utils.js';
import { getProjectsData, getHotTicketItems } from './data.js';

export function initializeCharts() {
    console.log('Initializing charts...');
    populateProgressCharts();
    populatePerformanceChart();
    populateFinancialTable();
    populateTrendsTable();
}

export function populateProgressCharts() {
    const chartsContainer = selectElement('#progress-charts');
    if (!chartsContainer) return;

    const projects = getProjectsData();
    chartsContainer.innerHTML = '';

    projects.forEach(project => {
        const chartItem = createProgressChartItem(project);
        chartsContainer.appendChild(chartItem);
    });
}

function createProgressChartItem(project) {
    const item = document.createElement('div');
    item.className = 'project-progress-item';
    
    const progressColor = getProgressColor(project.progress);
    const statusClass = project.status === 'active' ? 'active' : project.status === 'on-hold' ? 'warning' : 'success';
    
    item.innerHTML = `
        <div class="project-progress-info">
            <div class="project-progress-name">${project.name}</div>
            <div class="project-progress-details">
                <span class="pm-name">PM: ${project.pm}</span>
                <span class="project-phase">${project.phase}</span>
            </div>
        </div>
        <div class="progress-bar-container">
            <div class="progress-bar ${statusClass}" style="width: ${project.progress}%; background-color: ${progressColor}"></div>
        </div>
        <div class="progress-percentage">${project.progress}%</div>
    `;
    
    return item;
}

export function populatePerformanceChart() {
    const chartContainer = selectElement('#performance-chart');
    if (!chartContainer) return;

    const projects = getProjectsData();
    chartContainer.innerHTML = '';

    // Group projects by PM
    const pmData = {};
    projects.forEach(project => {
        if (!pmData[project.pm]) {
            pmData[project.pm] = {
                name: project.pm,
                projects: 0,
                totalProgress: 0,
                totalBudget: 0,
                totalSpent: 0,
                hotTickets: 0,
                overdueItems: 0
            };
        }
        
        pmData[project.pm].projects++;
        pmData[project.pm].totalProgress += project.progress;
        pmData[project.pm].totalBudget += project.budget;
        pmData[project.pm].totalSpent += project.spent;
        pmData[project.pm].hotTickets += project.hotTickets;
        pmData[project.pm].overdueItems += project.overdueItems;
    });

    Object.values(pmData).forEach(pm => {
        const pmItem = createPMPerformanceItem(pm);
        chartContainer.appendChild(pmItem);
    });
}

function createPMPerformanceItem(pm) {
    const item = document.createElement('div');
    item.className = 'pm-performance-item';
    
    const avgProgress = (pm.totalProgress / pm.projects).toFixed(1);
    const budgetEfficiency = ((pm.totalSpent / pm.totalBudget) * 100).toFixed(1);
    
    item.innerHTML = `
        <div class="pm-info">
            <div class="pm-avatar ${pm.name.toLowerCase()}">${pm.name.charAt(0)}</div>
            <div class="pm-details">
                <h4>${pm.name}</h4>
                <span>${pm.projects} Projects</span>
            </div>
        </div>
        <div class="pm-stats">
            <div class="pm-stat">
                <div class="pm-stat-value">${avgProgress}%</div>
                <div class="pm-stat-label">Avg Progress</div>
            </div>
            <div class="pm-stat">
                <div class="pm-stat-value">${budgetEfficiency}%</div>
                <div class="pm-stat-label">Budget Used</div>
            </div>
            <div class="pm-stat">
                <div class="pm-stat-value">${pm.hotTickets}</div>
                <div class="pm-stat-label">Hot Tickets</div>
            </div>
            <div class="pm-stat ${pm.overdueItems > 0 ? 'alert' : ''}">
                <div class="pm-stat-value">${pm.overdueItems}</div>
                <div class="pm-stat-label">Overdue</div>
            </div>
        </div>
    `;
    
    return item;
}

export function populateFinancialTable() {
    const tableContainer = selectElement('#financial-table');
    if (!tableContainer) return;

    const projects = getProjectsData();
    
    const table = document.createElement('table');
    table.className = 'analytics-table';
    
    table.innerHTML = `
        <thead>
            <tr>
                <th>Project</th>
                <th>PM</th>
                <th>Budget</th>
                <th>Spent</th>
                <th>Remaining</th>
                <th>% Used</th>
                <th>Status</th>
            </tr>
        </thead>
        <tbody>
            ${projects.map(project => {
                const remaining = project.budget - project.spent;
                const percentUsed = ((project.spent / project.budget) * 100).toFixed(1);
                const statusClass = project.status === 'active' ? 'text-success' : 
                                  project.status === 'on-hold' ? 'text-warning' : 'text-primary';
                
                return `
                    <tr>
                        <td><strong>${project.name}</strong></td>
                        <td>${project.pm}</td>
                        <td>$${formatCurrency(project.budget)}</td>
                        <td>$${formatCurrency(project.spent)}</td>
                        <td>$${formatCurrency(remaining)}</td>
                        <td>${percentUsed}%</td>
                        <td><span class="${statusClass}">${formatStatus(project.status)}</span></td>
                    </tr>
                `;
            }).join('')}
        </tbody>
    `;
    
    tableContainer.innerHTML = '';
    tableContainer.appendChild(table);
}

export function populateTrendsTable() {
    const tableContainer = selectElement('#trends-table');
    if (!tableContainer) return;

    const items = getHotTicketItems();
    
    // Calculate trends by type
    const typeStats = {};
    items.forEach(item => {
        if (!typeStats[item.type]) {
            typeStats[item.type] = {
                type: formatItemType(item.type),
                total: 0,
                urgent: 0,
                overdue: 0,
                completed: 0,
                pending: 0
            };
        }
        
        typeStats[item.type].total++;
        typeStats[item.type][item.status]++;
    });
    
    const table = document.createElement('table');
    table.className = 'analytics-table';
    
    table.innerHTML = `
        <thead>
            <tr>
                <th>Item Type</th>
                <th>Total</th>
                <th>Urgent</th>
                <th>Overdue</th>
                <th>Pending</th>
                <th>Completed</th>
                <th>Completion Rate</th>
            </tr>
        </thead>
        <tbody>
            ${Object.values(typeStats).map(stat => {
                const completionRate = stat.total > 0 ? ((stat.completed / stat.total) * 100).toFixed(1) : '0.0';
                
                return `
                    <tr>
                        <td><strong>${stat.type}</strong></td>
                        <td>${stat.total}</td>
                        <td class="text-danger">${stat.urgent || 0}</td>
                        <td class="text-warning">${stat.overdue || 0}</td>
                        <td class="text-info">${stat.pending || 0}</td>
                        <td class="text-success">${stat.completed || 0}</td>
                        <td>${completionRate}%</td>
                    </tr>
                `;
            }).join('')}
        </tbody>
    `;
    
    tableContainer.innerHTML = '';
    tableContainer.appendChild(table);
}

function getProgressColor(progress) {
    if (progress >= 90) return '#10b981'; // Green
    if (progress >= 70) return '#3b82f6'; // Blue
    if (progress >= 50) return '#f59e0b'; // Yellow
    if (progress >= 25) return '#ef4444'; // Red
    return '#6b7280'; // Gray
}

function formatCurrency(amount) {
    return (amount / 1000).toFixed(0) + 'K';
}

function formatStatus(status) {
    return status.split('-').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
}

function formatItemType(type) {
    const typeMap = {
        'tm': 'T&M Ticket',
        'lien': 'Lien Release',
        'payapp': 'Pay Application',
        'rfi': 'RFI',
        'submittal': 'Submittal',
        'commitment': 'Commitment'
    };
    return typeMap[type] || type.toUpperCase();
}

export function updateChart(chartId, data) {
    console.log(`Updating chart ${chartId} with data:`, data);
    // This would be used for dynamic chart updates
}
