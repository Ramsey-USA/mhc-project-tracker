import { selectElement, createElement, appendChildren } from './utils.js';
import { getFinancialData, getProgressData, getPerformanceData, getHotTicketItems, getProjectsData } from './data.js';

// Function to update financial metrics
export function updateFinancialMetrics() {
    const data = getFinancialData();
    const financialValue = selectElement('#financial-value');
    const financialProgress = selectElement('#financial-progress');
    const totalBudget = selectElement('#total-budget');
    const budgetSpent = selectElement('#budget-spent');
    
    if (financialValue) financialValue.textContent = `$${data.spent}`;
    if (financialProgress) financialProgress.style.width = `${data.progress}%`;
    if (totalBudget) totalBudget.textContent = `$${data.totalBudget}`;
    if (budgetSpent) budgetSpent.textContent = `$${data.spent} spent`;
}

// Function to update progress metrics
export function updateProgressMetrics() {
    const data = getProgressData();
    const progressValue = selectElement('#progress-value');
    const progressBar = selectElement('#progress-bar');
    const avgProgress = selectElement('#avg-progress');
    const progressTrend = selectElement('#progress-trend');
    
    if (progressValue) progressValue.textContent = `${data.progress.toFixed(1)}%`;
    if (progressBar) progressBar.style.width = `${data.progress}%`;
    if (avgProgress) avgProgress.textContent = `${data.progress.toFixed(1)}%`;
    if (progressTrend) progressTrend.textContent = `+${data.progress.toFixed(1)}% this month`;
}

// Function to update performance metrics
export function updatePerformanceMetrics() {
    const data = getPerformanceData();
    const performanceValue = selectElement('#performance-value');
    const performanceBar = selectElement('#performance-bar');
    const avgCompletion = selectElement('#avg-completion');
    const completionTrend = selectElement('#completion-trend');
    
    if (performanceValue) performanceValue.textContent = `${data.issuesResolved}`;
    if (performanceBar) performanceBar.style.width = `${data.efficiency}%`;
    if (avgCompletion) avgCompletion.textContent = `${data.efficiency.toFixed(1)}`;
    if (completionTrend) completionTrend.textContent = `Items completed`;
}

// Function to update efficiency metrics
export function updateEfficiencyMetrics() {
    const data = getPerformanceData();
    const efficiencyValue = selectElement('#efficiency-value');
    const efficiencyBar = selectElement('#efficiency-bar');
    const efficiencyScore = selectElement('#efficiency-score');
    const efficiencyTrend = selectElement('#efficiency-trend');
    
    if (efficiencyValue) efficiencyValue.textContent = `${data.efficiency.toFixed(0)}`;
    if (efficiencyBar) efficiencyBar.style.width = `${data.efficiency}%`;
    if (efficiencyScore) efficiencyScore.textContent = `${data.efficiency.toFixed(1)}%`;
    if (efficiencyTrend) efficiencyTrend.textContent = `Based on targets`;
}

// Function to initialize carousel navigation
export function initializeCarousel() {
    let currentIndex = 0;
    const carousel = selectElement('#quick-add-carousel');
    const prevBtn = selectElement('#carousel-prev');
    const nextBtn = selectElement('#carousel-next');
    
    if (!carousel || !prevBtn || !nextBtn) {
        console.warn('Carousel elements not found, skipping carousel initialization');
        return;
    }
    
    const items = carousel.children;
    const totalItems = items.length;

    function updateCarousel() {
        Array.from(items).forEach((item, index) => {
            item.style.display = index === currentIndex ? 'block' : 'none';
        });
    }

    prevBtn.addEventListener('click', () => {
        currentIndex = (currentIndex - 1 + totalItems) % totalItems;
        updateCarousel();
    });

    nextBtn.addEventListener('click', () => {
        currentIndex = (currentIndex + 1) % totalItems;
        updateCarousel();
    });

    updateCarousel();
}

// Function to populate hot ticket items
export function populateHotTicketItems() {
    const itemsContainer = selectElement('#items-container');
    if (!itemsContainer) {
        console.warn('Items container not found');
        return;
    }

    const items = getHotTicketItems();
    const projects = getProjectsData();
    itemsContainer.innerHTML = '';

    if (items.length === 0) {
        itemsContainer.innerHTML = '<div class="no-items">No hot ticket items found.</div>';
        return;
    }

    items.forEach(item => {
        const project = projects.find(p => p.id === item.project);
        const itemCard = createItemCard(item, project);
        itemsContainer.appendChild(itemCard);
    });
}

function createItemCard(item, project) {
    const statusClass = getItemStatusClass(item.status);
    const typeIcon = getItemTypeIcon(item.type);
    const priorityClass = `priority-${item.priority}`;
    
    const card = createElement('div', { 
        class: `item-card ${statusClass} ${priorityClass}`,
        'data-item-id': item.id 
    });

    const projectName = project ? project.name : 'Unknown Project';
    
    card.innerHTML = `
        <div class="item-header">
            <div class="item-type">
                <i class="${typeIcon}"></i>
                <span class="type-label">${formatItemType(item.type)}</span>
            </div>
            <div class="item-priority">
                <span class="priority-badge priority-${item.priority}">${item.priority.toUpperCase()}</span>
                <span class="status-badge status-${item.status}">${formatItemStatus(item.status)}</span>
            </div>
        </div>
        
        <div class="item-body">
            <div class="item-title">
                ${getItemTitle(item)}
            </div>
            
            <div class="item-description">
                ${item.description || getItemDescription(item)}
            </div>
            
            <div class="item-details">
                <div class="detail-item">
                    <i class="fas fa-building"></i>
                    <span>${projectName}</span>
                </div>
                <div class="detail-item">
                    <i class="fas fa-calendar"></i>
                    <span>Due: ${formatItemDate(item.dueDate)}</span>
                </div>
                <div class="detail-item">
                    <i class="fas fa-user"></i>
                    <span>Ball in Court: ${formatBallInCourt(item.ballInCourt)}</span>
                </div>
                ${item.amount ? `
                    <div class="detail-item">
                        <i class="fas fa-dollar-sign"></i>
                        <span>$${item.amount.toLocaleString()}</span>
                    </div>
                ` : ''}
            </div>
        </div>
        
        <div class="item-actions">
            <button class="btn btn-sm btn-secondary" onclick="editItem('${item.id}')">
                <i class="fas fa-edit"></i> Edit
            </button>
            <button class="btn btn-sm btn-info" onclick="logContact('${item.id}')">
                <i class="fas fa-phone"></i> Contact
            </button>
            <button class="btn btn-sm btn-success" onclick="completeItem('${item.id}')">
                <i class="fas fa-check"></i> Complete
            </button>
        </div>
    `;

    return card;
}

function getItemStatusClass(status) {
    const statusMap = {
        'urgent': 'item-urgent',
        'overdue': 'item-overdue',
        'pending': 'item-pending',
        'completed': 'item-completed'
    };
    return statusMap[status] || 'item-pending';
}

function getItemTypeIcon(type) {
    const iconMap = {
        'tm': 'fas fa-clock',
        'lien': 'fas fa-file-contract',
        'payapp': 'fas fa-money-check',
        'rfi': 'fas fa-question-circle',
        'submittal': 'fas fa-file-upload',
        'commitment': 'fas fa-handshake'
    };
    return iconMap[type] || 'fas fa-file';
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

function formatItemStatus(status) {
    return status.charAt(0).toUpperCase() + status.slice(1);
}

function getItemTitle(item) {
    switch(item.type) {
        case 'tm':
            return `${item.employee} - ${item.hours}hrs`;
        case 'rfi':
            return `${item.rfiNumber}: ${item.subject}`;
        case 'submittal':
            return `${item.submittalType} - ${item.vendor}`;
        case 'lien':
            return `${item.vendor} - ${item.releaseType}`;
        case 'payapp':
            return `${item.payAppNumber} - $${item.amount.toLocaleString()}`;
        case 'commitment':
            return `${item.subcontractor} - ${item.trade}`;
        default:
            return 'Item Details';
    }
}

function getItemDescription(item) {
    switch(item.type) {
        case 'tm':
            return item.description || 'Time and materials work';
        case 'rfi':
            return item.description || 'Request for information';
        case 'submittal':
            return item.description || 'Submittal for review';
        case 'lien':
            return `${item.releaseType} lien release for $${item.amount.toLocaleString()}`;
        case 'payapp':
            return `Payment application for period ending ${formatItemDate(item.periodEnding)}`;
        case 'commitment':
            return item.workDescription || 'Subcontractor commitment';
        default:
            return 'No description available';
    }
}

function formatBallInCourt(ballInCourt) {
    const courtMap = {
        'mhc': 'MHC',
        'client': 'Client',
        'vendor': 'Vendor',
        'architect': 'Architect',
        'subcontractor': 'Subcontractor'
    };
    return courtMap[ballInCourt] || ballInCourt;
}

function formatItemDate(dateString) {
    const date = new Date(dateString);
    const today = new Date();
    const diffTime = date - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) {
        return `${Math.abs(diffDays)} days overdue`;
    } else if (diffDays === 0) {
        return 'Due today';
    } else if (diffDays === 1) {
        return 'Due tomorrow';
    } else {
        return date.toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric'
        });
    }
}

// Function to show modals
export function showAddModal(type) {
    alert(`Show modal for adding ${type}`); // Replace with actual modal logic
}

// Function to open a modal
export function openModal(modalId) {
    const modal = selectElement(`#${modalId}`);
    if (modal) {
        modal.style.display = 'block';
    }
}

// Function to close a modal
export function closeModal(modalId) {
    const modal = selectElement(`#${modalId}`);
    if (modal) {
        modal.style.display = 'none';
    }
}

// Function to handle form submission for adding items
export function addItem(event, type) {
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);
    const itemData = {};

    formData.forEach((value, key) => {
        itemData[key] = value;
    });

    console.log(`Adding ${type} item:`, itemData);

    // Close the modal after submission
    closeModal(`${type}-modal`);

    // Clear the form
    form.reset();

    // Add logic to update the dashboard or save the item
    alert(`${type} item added successfully!`);
}

// Function to initialize the dashboard
export function initializeDashboard() {
    updateFinancialMetrics();
    updateProgressMetrics();
    updatePerformanceMetrics();
    updateEfficiencyMetrics();
    initializeCarousel();
    populateHotTicketItems();

    console.log('Dashboard initialized');
}