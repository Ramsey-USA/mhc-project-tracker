// filters.js
// Handles filter population and functionality

import { selectElement } from './utils.js';
import { getProjectsData, getHotTicketItems } from './data.js';

export function initializeFilters() {
    console.log('Initializing filters...');
    populatePMFilter();
    populateTypeFilter();
}

export function populatePMFilter() {
    const pmFilter = selectElement('#pm-filter');
    if (!pmFilter) return;

    const projects = getProjectsData();
    const items = getHotTicketItems();
    
    // Get unique PMs from both projects and items
    const pms = new Set();
    
    projects.forEach(project => {
        if (project.pm) pms.add(project.pm);
    });
    
    items.forEach(item => {
        if (item.pm) pms.add(item.pm);
    });
    
    // Clear existing options except "All PMs"
    pmFilter.innerHTML = '<option value="">All PMs</option>';
    
    // Add PM options
    Array.from(pms).sort().forEach(pm => {
        const option = document.createElement('option');
        option.value = pm;
        option.textContent = pm;
        pmFilter.appendChild(option);
    });
}

export function populateTypeFilter() {
    const typeFilter = selectElement('#type-filter');
    if (!typeFilter) return;

    const items = getHotTicketItems();
    
    // Get unique types
    const types = new Set();
    items.forEach(item => {
        if (item.type) types.add(item.type);
    });
    
    // Clear existing options except "All Types"
    typeFilter.innerHTML = '<option value="">All Types</option>';
    
    // Add type options with proper labels
    const typeLabels = {
        'tm': 'T&M',
        'lien': 'Lien Release',
        'payapp': 'Pay App',
        'rfi': 'RFI',
        'submittal': 'Submittal',
        'commitment': 'Commitment',
        'change-order': 'Change Order',
        'invoice': 'Invoice',
        'permit': 'Permit'
    };
    
    Array.from(types).sort().forEach(type => {
        const option = document.createElement('option');
        option.value = type;
        option.textContent = typeLabels[type] || type.toUpperCase();
        typeFilter.appendChild(option);
    });
}

export function filterItems() {
    const pmFilter = selectElement('#pm-filter');
    const typeFilter = selectElement('#type-filter');
    const searchInput = selectElement('#search-input');
    
    const pmValue = pmFilter ? pmFilter.value : '';
    const typeValue = typeFilter ? typeFilter.value : '';
    const searchValue = searchInput ? searchInput.value.toLowerCase() : '';
    
    const items = getHotTicketItems();
    
    const filteredItems = items.filter(item => {
        const matchesPM = !pmValue || item.pm === pmValue;
        const matchesType = !typeValue || item.type === typeValue;
        const matchesSearch = !searchValue || 
            item.title.toLowerCase().includes(searchValue) ||
            item.project.toLowerCase().includes(searchValue) ||
            item.pm.toLowerCase().includes(searchValue) ||
            item.description.toLowerCase().includes(searchValue);
        
        return matchesPM && matchesType && matchesSearch;
    });
    
    // Re-populate the hot ticket items with filtered results
    updateHotTicketItemsDisplay(filteredItems);
    
    console.log(`Filtered ${filteredItems.length} items from ${items.length} total`);
}

function updateHotTicketItemsDisplay(items) {
    const itemsContainer = selectElement('#hot-ticket-items');
    if (!itemsContainer) return;
    
    itemsContainer.innerHTML = '';
    
    if (items.length === 0) {
        itemsContainer.innerHTML = `
            <div class="no-items-message">
                <p>No items match the current filters.</p>
                <button class="btn btn-secondary" onclick="clearFilters()">Clear Filters</button>
            </div>
        `;
        return;
    }
    
    items.forEach(item => {
        const itemElement = createItemCard(item);
        itemsContainer.appendChild(itemElement);
    });
}

function createItemCard(item) {
    const card = document.createElement('div');
    card.className = `item-card ${item.status}`;
    
    card.innerHTML = `
        <div class="item-header">
            <div class="item-type ${item.type}">${formatItemType(item.type)}</div>
            <div class="item-status ${item.status}">${formatStatus(item.status)}</div>
        </div>
        <div class="item-content">
            <h4 class="item-title">${item.title}</h4>
            <p class="item-description">${item.description}</p>
            <div class="item-meta">
                <span class="item-project">📁 ${item.project}</span>
                <span class="item-pm">👤 ${item.pm}</span>
                <span class="item-date">📅 ${item.dueDate}</span>
            </div>
        </div>
        <div class="item-actions">
            <button class="btn btn-sm btn-primary" onclick="viewItem('${item.id}')">View</button>
            <button class="btn btn-sm btn-secondary" onclick="editItem('${item.id}')">Edit</button>
            ${item.status !== 'completed' ? 
                `<button class="btn btn-sm btn-success" onclick="completeItem('${item.id}')">Complete</button>` : 
                ''}
        </div>
    `;
    
    return card;
}

function formatItemType(type) {
    const typeMap = {
        'tm': 'T&M',
        'lien': 'Lien Release',
        'payapp': 'Pay App',
        'rfi': 'RFI',
        'submittal': 'Submittal',
        'commitment': 'Commitment',
        'change-order': 'Change Order',
        'invoice': 'Invoice',
        'permit': 'Permit'
    };
    return typeMap[type] || type.toUpperCase();
}

function formatStatus(status) {
    return status.split('-').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
}

export function performSearch() {
    filterItems();
}

export function clearFilters() {
    const pmFilter = selectElement('#pm-filter');
    const typeFilter = selectElement('#type-filter');
    const searchInput = selectElement('#search-input');
    
    if (pmFilter) pmFilter.value = '';
    if (typeFilter) typeFilter.value = '';
    if (searchInput) searchInput.value = '';
    
    filterItems();
}

export function applyFilters(filters) {
    console.log('Applying filters:', filters);
    // Add logic to apply filters to the dashboard
}
