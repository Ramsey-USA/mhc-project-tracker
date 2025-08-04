// projects.js
// Manages the Active Projects grid

import { selectElement, createElement, appendChildren } from './utils.js';
import { getProjectsData } from './data.js';

export function initializeProjects() {
    console.log('Initializing projects...');
    populateProjectsGrid();
}

export function populateProjectsGrid() {
    const projectsGrid = selectElement('#projects-grid');
    if (!projectsGrid) {
        console.warn('Projects grid element not found');
        return;
    }

    const projects = getProjectsData();
    projectsGrid.innerHTML = ''; // Clear existing content

    projects.forEach(project => {
        const projectCard = createProjectCard(project);
        projectsGrid.appendChild(projectCard);
    });
}

function createProjectCard(project) {
    const statusClass = getStatusClass(project.status);
    const progressColor = getProgressColor(project.progress);
    
    const card = createElement('div', { 
        class: `project-card ${statusClass}`,
        'data-project-id': project.id 
    });

    card.innerHTML = `
        <div class="project-header">
            <div class="project-title">
                <h3>${project.name}</h3>
                <div class="project-meta">
                    <span class="pm-badge">PM: ${project.pm}</span>
                    <span class="status-badge status-${project.status}">${formatStatus(project.status)}</span>
                </div>
            </div>
            <div class="project-actions">
                <button class="btn btn-sm btn-secondary" onclick="editProject('${project.id}')">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-sm btn-info" onclick="viewProjectDetails('${project.id}')">
                    <i class="fas fa-eye"></i>
                </button>
            </div>
        </div>
        
        <div class="project-body">
            <div class="project-description">
                <p>${project.description}</p>
            </div>
            
            <div class="project-progress">
                <div class="progress-header">
                    <span>Progress</span>
                    <span class="progress-percentage">${project.progress}%</span>
                </div>
                <div class="progress-bar-container">
                    <div class="progress-bar" style="width: ${project.progress}%; background-color: ${progressColor}"></div>
                </div>
                <div class="progress-phase">
                    <i class="fas fa-cog"></i>
                    <span>Current Phase: ${project.phase}</span>
                </div>
            </div>
            
            <div class="project-stats">
                <div class="stat-item">
                    <div class="stat-value">$${formatCurrency(project.spent)}</div>
                    <div class="stat-label">Spent</div>
                </div>
                <div class="stat-item">
                    <div class="stat-value">$${formatCurrency(project.budget)}</div>
                    <div class="stat-label">Budget</div>
                </div>
                <div class="stat-item">
                    <div class="stat-value">${project.hotTickets}</div>
                    <div class="stat-label">Hot Tickets</div>
                </div>
                <div class="stat-item ${project.overdueItems > 0 ? 'stat-alert' : ''}">
                    <div class="stat-value">${project.overdueItems}</div>
                    <div class="stat-label">Overdue</div>
                </div>
            </div>
            
            <div class="project-timeline">
                <div class="timeline-item">
                    <i class="fas fa-play"></i>
                    <span>Started: ${formatDate(project.startDate)}</span>
                </div>
                <div class="timeline-item">
                    <i class="fas fa-flag-checkered"></i>
                    <span>Due: ${formatDate(project.endDate)}</span>
                </div>
            </div>
            
            ${project.notes ? `
                <div class="project-notes">
                    <i class="fas fa-sticky-note"></i>
                    <span>${project.notes}</span>
                </div>
            ` : ''}
        </div>
    `;

    return card;
}

function getStatusClass(status) {
    const statusMap = {
        'active': 'project-active',
        'on-hold': 'project-on-hold',
        'completed': 'project-completed',
        'cancelled': 'project-cancelled'
    };
    return statusMap[status] || 'project-active';
}

function getProgressColor(progress) {
    if (progress >= 90) return '#10b981'; // Green
    if (progress >= 70) return '#3b82f6'; // Blue
    if (progress >= 50) return '#f59e0b'; // Yellow
    if (progress >= 25) return '#ef4444'; // Red
    return '#6b7280'; // Gray
}

function formatStatus(status) {
    return status.split('-').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
}

function formatCurrency(amount) {
    return (amount / 1000).toFixed(0) + 'K';
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric' 
    });
}

export function addNewProject(projectData) {
    console.log('Adding new project:', projectData);
    // This would typically add to the data source and refresh the grid
    populateProjectsGrid();
}
