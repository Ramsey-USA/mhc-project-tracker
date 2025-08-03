// MHC Projec// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeData();
    loadData();
    loadSavedFilters();
    renderDashboard();
    updateStats();
    initializeCarousel();
    
    // Set default dates
    const today = new Date().toISOString().split('T')[0];
    const nextWeek = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    
    // Set default due dates in forms
    document.querySelectorAll('input[name="dueDate"]').forEach(input => {
        if (!input.value) input.value = nextWeek;
    });
    
    document.querySelectorAll('input[name="date"], input[name="initiatedDate"]').forEach(input => {
        if (!input.value) input.value = today;
    });
    
    // Initialize keyboard shortcuts
    initializeKeyboardShortcuts();
});

// Keyboard Shortcuts
function initializeKeyboardShortcuts() {
    document.addEventListener('keydown', function(e) {
        // Only handle shortcuts when not in input fields
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'SELECT') {
            return;
        }
        
        // Handle shortcut combinations
        if (e.ctrlKey || e.metaKey) {
            switch (e.key) {
                case 'k': // Ctrl+K - Focus search
                    e.preventDefault();
                    document.getElementById('search-input').focus();
                    break;
                case 'n': // Ctrl+N - New item (show quick actions)
                    e.preventDefault();
                    document.querySelector('.quick-add-section').scrollIntoView({ behavior: 'smooth' });
                    break;
                case 'f': // Ctrl+F - Toggle advanced filters
                    e.preventDefault();
                    toggleAdvancedFilters();
                    break;
                case 's': // Ctrl+S - Save current filters
                    e.preventDefault();
                    saveCurrentFilters();
                    break;
            }
        } else {
            switch (e.key) {
                case 'Escape':
                    // Close any open modals
                    document.querySelectorAll('.modal').forEach(modal => {
                        if (modal.style.display === 'block') {
                            modal.style.display = 'none';
                        }
                    });
                    break;
                case '/': // Focus search with /
                    e.preventDefault();
                    document.getElementById('search-input').focus();
                    break;
            }
        }
    });
    
    // Show keyboard shortcuts help
    const helpButton = document.createElement('button');
    helpButton.className = 'btn btn-sm btn-secondary';
    helpButton.innerHTML = '<i class="fas fa-keyboard"></i> Shortcuts';
    helpButton.onclick = showKeyboardShortcuts;
    
    const filterActions = document.querySelector('.filter-actions');
    if (filterActions) {
        filterActions.appendChild(helpButton);
    }
}

function showKeyboardShortcuts() {
    const shortcuts = `
    <div style="text-align: left; line-height: 1.6;">
        <h4 style="margin-bottom: 1rem; color: var(--primary-600);">Keyboard Shortcuts</h4>
        <div style="display: grid; grid-template-columns: 1fr 2fr; gap: 0.5rem; margin-bottom: 1rem;">
            <strong>Ctrl + K</strong><span>Focus search box</span>
            <strong>Ctrl + N</strong><span>Scroll to quick actions</span>
            <strong>Ctrl + F</strong><span>Toggle advanced filters</span>
            <strong>Ctrl + S</strong><span>Save current filters</span>
            <strong>/</strong><span>Focus search box</span>
            <strong>Escape</strong><span>Close modals</span>
            <strong>←/→</strong><span>Navigate carousel (when focused)</span>
        </div>
        <p style="color: var(--gray-600); font-size: 0.9rem;">
            <i class="fas fa-lightbulb"></i> Tip: Use Tab to navigate through controls efficiently!
        </p>
    </div>
    `;
    
    const existingModal = document.getElementById('shortcuts-modal');
    if (existingModal) {
        existingModal.remove();
    }
    
    const modal = document.createElement('div');
    modal.id = 'shortcuts-modal';
    modal.className = 'modal';
    modal.style.display = 'block';
    modal.innerHTML = `
        <div class="modal-content" style="max-width: 500px;">
            <div class="modal-header">
                <h3><i class="fas fa-keyboard"></i> Keyboard Shortcuts</h3>
                <span class="close" onclick="this.closest('.modal').remove()">&times;</span>
            </div>
            <div style="padding: 2rem;">
                ${shortcuts}
                <div style="text-align: center; margin-top: 1.5rem;">
                    <button class="btn btn-primary" onclick="this.closest('.modal').remove()">Got it!</button>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
}

// Carousel Functionality
let currentCarouselIndex = 0;
let itemsPerView = 3;
let totalItems = 6;

function initializeCarousel() {
    updateItemsPerView();
    createCarouselIndicators();
    updateCarouselView();
    
    // Add resize listener
    window.addEventListener('resize', () => {
        updateItemsPerView();
        updateCarouselView();
        createCarouselIndicators();
    });
    
    // Add keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.target.closest('.quick-add-section')) {
            if (e.key === 'ArrowLeft') {
                e.preventDefault();
                moveCarousel(-1);
            } else if (e.key === 'ArrowRight') {
                e.preventDefault();
                moveCarousel(1);
            }
        }
    });
    
    // Add touch/swipe support for mobile
    addTouchSupport();
}

function addTouchSupport() {
    const carousel = document.getElementById('quick-add-carousel');
    if (!carousel) return;
    
    let startX = 0;
    let currentX = 0;
    let isDragging = false;
    
    carousel.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
        isDragging = true;
    });
    
    carousel.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
        currentX = e.touches[0].clientX;
    });
    
    carousel.addEventListener('touchend', () => {
        if (!isDragging) return;
        isDragging = false;
        
        const diff = startX - currentX;
        const threshold = 50;
        
        if (Math.abs(diff) > threshold) {
            if (diff > 0) {
                moveCarousel(1); // Swipe left - move forward
            } else {
                moveCarousel(-1); // Swipe right - move backward
            }
        }
    });
}

function updateItemsPerView() {
    const width = window.innerWidth;
    if (width <= 480) {
        itemsPerView = 1;
    } else if (width <= 768) {
        itemsPerView = 2;
    } else if (width <= 1024) {
        itemsPerView = 3;
    } else {
        itemsPerView = Math.min(4, totalItems);
    }
}

function createCarouselIndicators() {
    const indicatorsContainer = document.getElementById('carousel-indicators');
    if (!indicatorsContainer) return;
    
    const totalPages = Math.ceil(totalItems / itemsPerView);
    indicatorsContainer.innerHTML = '';
    
    for (let i = 0; i < totalPages; i++) {
        const indicator = document.createElement('div');
        indicator.className = `carousel-indicator ${i === Math.floor(currentCarouselIndex / itemsPerView) ? 'active' : ''}`;
        indicator.onclick = () => goToCarouselPage(i);
        indicatorsContainer.appendChild(indicator);
    }
}

function updateCarouselView() {
    const carousel = document.getElementById('quick-add-carousel');
    const prevBtn = document.getElementById('carousel-prev');
    const nextBtn = document.getElementById('carousel-next');
    
    if (!carousel) return;
    
    // Calculate transform
    const itemWidth = 200 + 16; // button width + gap
    const offset = currentCarouselIndex * itemWidth;
    carousel.style.transform = `translateX(-${offset}px)`;
    
    // Update button states
    if (prevBtn) {
        prevBtn.disabled = currentCarouselIndex === 0;
    }
    
    if (nextBtn) {
        nextBtn.disabled = currentCarouselIndex >= totalItems - itemsPerView;
    }
    
    // Update indicators
    updateCarouselIndicators();
}

function updateCarouselIndicators() {
    const indicators = document.querySelectorAll('.carousel-indicator');
    const currentPage = Math.floor(currentCarouselIndex / itemsPerView);
    
    indicators.forEach((indicator, index) => {
        indicator.classList.toggle('active', index === currentPage);
    });
}

function moveCarousel(direction) {
    const maxIndex = totalItems - itemsPerView;
    
    if (direction > 0 && currentCarouselIndex < maxIndex) {
        currentCarouselIndex = Math.min(currentCarouselIndex + 1, maxIndex);
    } else if (direction < 0 && currentCarouselIndex > 0) {
        currentCarouselIndex = Math.max(currentCarouselIndex - 1, 0);
    }
    
    updateCarouselView();
}

function goToCarouselPage(pageIndex) {
    currentCarouselIndex = pageIndex * itemsPerView;
    currentCarouselIndex = Math.min(currentCarouselIndex, totalItems - itemsPerView);
    updateCarouselView();
}

// Global Data Storage
let hotTicketItems = [];
let projects = [];
let contactLog = [];

// Initialize the app// Save data to localStorage
function saveData() {
    localStorage.setItem('mhc_hotTicketItems', JSON.stringify(hotTicketItems));
    localStorage.setItem('mhc_projects', JSON.stringify(projects));
    localStorage.setItem('mhc_contactLog', JSON.stringify(contactLog));
    localStorage.setItem('mhc_lastSaved', new Date().toLocaleString());
}on
document.addEventListener('DOMContentLoaded', function() {
    initializeData();
    loadData();
    renderDashboard();
    updateStats();
    
    // Set default dates
    const today = new Date().toISOString().split('T')[0];
    const nextWeek = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    
    // Set default due dates in forms
    document.querySelectorAll('input[name="dueDate"]').forEach(input => {
        if (!input.value) input.value = nextWeek;
    });
    
    document.querySelectorAll('input[name="date"], input[name="initiatedDate"]').forEach(input => {
        if (!input.value) input.value = today;
    });
});

// Initialize default data
function initializeData() {
    projects = [
        {
            id: 'makayla-job1',
            name: 'Makayla - Office Complex',
            pm: 'Makayla',
            status: 'active',
            startDate: '2024-01-15',
            endDate: '2024-08-30',
            description: 'Modern office complex with 150,000 sq ft of space',
            notes: 'Client requested eco-friendly materials'
        },
        {
            id: 'makayla-job2',
            name: 'Makayla - Retail Center',
            pm: 'Makayla',
            status: 'active',
            startDate: '2024-03-01',
            endDate: '2024-10-15',
            description: 'Shopping center with 12 retail units',
            notes: 'Phase 1 completion targeted for September'
        },
        {
            id: 'ben-job1',
            name: 'Ben - Warehouse Expansion',
            pm: 'Ben',
            status: 'active',
            startDate: '2024-02-01',
            endDate: '2024-09-30',
            description: 'Expanding existing warehouse by 50,000 sq ft',
            notes: 'Working around operational constraints'
        },
        {
            id: 'ben-job2',
            name: 'Ben - Manufacturing Plant',
            pm: 'Ben',
            status: 'active',
            startDate: '2024-04-01',
            endDate: '2024-12-15',
            description: 'New manufacturing facility with clean room requirements',
            notes: 'Specialized HVAC systems required'
        },
        {
            id: 'ben-job3',
            name: 'Ben - Distribution Center',
            pm: 'Ben',
            status: 'active',
            startDate: '2024-05-15',
            endDate: '2025-01-30',
            description: 'Automated distribution center with conveyor systems',
            notes: 'Integration with existing logistics network'
        },
        {
            id: 'jeremy-darigold',
            name: 'Jeremy - Darigold Plant',
            pm: 'Jeremy',
            status: 'active',
            startDate: '2024-01-01',
            endDate: '2024-11-30',
            description: 'Dairy processing facility upgrade and expansion',
            notes: 'Food safety compliance critical'
        }
    ];

    // Sample hot ticket items
    hotTicketItems = [
        {
            id: generateId(),
            type: 'tm',
            project: 'jeremy-darigold',
            employee: 'John Smith',
            hours: 8.5,
            description: 'Electrical rough-in for production line 3',
            materials: 'Conduit, wire, junction boxes',
            tools: 'Drill, wire puller, multimeter',
            date: '2024-07-25',
            dueDate: '2024-07-29',
            priority: 'high',
            paidStatus: 'unpaid',
            ballInCourt: 'mhc',
            status: 'pending',
            notes: 'Need approval from electrical engineer',
            createdDate: new Date().toISOString(),
            lastContact: null
        },
        {
            id: generateId(),
            type: 'lien',
            project: 'ben-job1',
            vendor: 'ABC Concrete Co.',
            releaseType: 'conditional',
            amount: 45000,
            dueDate: '2024-07-30',
            expirationDate: '2024-08-15',
            priority: 'critical',
            ballInCourt: 'vendor',
            status: 'pending',
            notes: 'Waiting for signed release form',
            createdDate: new Date().toISOString(),
            lastContact: null
        },
        {
            id: generateId(),
            type: 'payapp',
            project: 'makayla-job1',
            payAppNumber: 'PA-2024-003',
            amount: 125000,
            dueDate: '2024-08-01',
            approvalStatus: 'pending',
            ballInCourt: 'client',
            priority: 'high',
            periodEnding: '2024-07-31',
            status: 'pending',
            notes: 'Submitted to client for review',
            createdDate: new Date().toISOString(),
            lastContact: null
        }
    ];
}

// Generate unique ID
function generateId() {
    return 'item_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

// Load data from localStorage
function loadData() {
    const savedItems = localStorage.getItem('mhc_hot_ticket_items');
    const savedProjects = localStorage.getItem('mhc_projects');
    const savedContactLog = localStorage.getItem('mhc_contact_log');
    
    if (savedItems) {
        hotTicketItems = JSON.parse(savedItems);
    }
    
    if (savedProjects) {
        projects = JSON.parse(savedProjects);
    }
    
    if (savedContactLog) {
        contactLog = JSON.parse(savedContactLog);
    }
}

// Save data to localStorage
function saveData() {
    localStorage.setItem('mhc_hot_ticket_items', JSON.stringify(hotTicketItems));
    localStorage.setItem('mhc_projects', JSON.stringify(projects));
    localStorage.setItem('mhc_contact_log', JSON.stringify(contactLog));
}

// Calculate days until due date
function getDaysUntilDue(dueDate) {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
}

// Get item status based on due date
function getItemStatus(item) {
    const daysUntil = getDaysUntilDue(item.dueDate);
    
    if (daysUntil < 0) return 'overdue';
    if (daysUntil <= 1) return 'urgent';
    if (item.status === 'completed') return 'completed';
    return 'pending';
}

// Update dashboard statistics
function updateStats() {
    const urgentCount = hotTicketItems.filter(item => getItemStatus(item) === 'urgent').length;
    const overdueCount = hotTicketItems.filter(item => getItemStatus(item) === 'overdue').length;
    const totalCount = hotTicketItems.filter(item => item.status !== 'completed').length;
    const completedToday = hotTicketItems.filter(item => {
        const today = new Date().toISOString().split('T')[0];
        return item.status === 'completed' && item.completedDate === today;
    }).length;
    
    document.getElementById('urgent-count').textContent = urgentCount;
    document.getElementById('overdue-count').textContent = overdueCount;
    document.getElementById('total-count').textContent = totalCount;
    document.getElementById('completed-count').textContent = completedToday;
}

// Render the main dashboard
function renderDashboard() {
    renderProjects();
    renderItems();
    updateStats();
    updateProjectDropdowns();
}

// Render projects grid
function renderProjects() {
    const projectsGrid = document.getElementById('projects-grid');
    projectsGrid.innerHTML = '';
    
    projects.forEach(project => {
        const projectItems = hotTicketItems.filter(item => item.project === project.id);
        const urgentItems = projectItems.filter(item => getItemStatus(item) === 'urgent').length;
        const overdueItems = projectItems.filter(item => getItemStatus(item) === 'overdue').length;
        const totalItems = projectItems.filter(item => item.status !== 'completed').length;
        
        let statusClass = 'good';
        let statusText = 'On Track';
        
        if (overdueItems > 0) {
            statusClass = 'urgent';
            statusText = 'Overdue Items';
        } else if (urgentItems > 0) {
            statusClass = 'warning';
            statusText = 'Urgent Items';
        }
        
        const projectCard = document.createElement('div');
        projectCard.className = `project-card ${project.pm.toLowerCase()}`;
        projectCard.style.cursor = 'pointer';
        projectCard.setAttribute('data-project-id', project.id);
        projectCard.onclick = () => openProjectEditor(project.id);
        projectCard.innerHTML = `
            <div class="project-header">
                <div>
                    <div class="project-title">${project.name}</div>
                    <div class="project-pm">PM: ${project.pm}</div>
                </div>
                <div style="display: flex; align-items: center; gap: 0.5rem;">
                    <div class="project-status status-${statusClass}">${statusText}</div>
                    <i class="fas fa-edit" style="color: var(--gray-400); font-size: 0.875rem;" title="Click to edit project"></i>
                </div>
            </div>
            <div class="project-stats">
                <div class="project-stat">
                    <div class="project-stat-number">${totalItems}</div>
                    <div class="project-stat-label">Active Items</div>
                </div>
                <div class="project-stat">
                    <div class="project-stat-number">${urgentItems + overdueItems}</div>
                    <div class="project-stat-label">Needs Attention</div>
                </div>
            </div>
        `;
        
        projectsGrid.appendChild(projectCard);
    });
}

// Render items list
function renderItems() {
    const filteredItems = filterItems();
    // The filtering and rendering is now handled by filterItems() and renderFilteredItems()
}

// Get item type display name
function getItemTypeDisplay(type) {
    const typeMap = {
        'tm': 'T&M Ticket',
        'lien': 'Lien Release',
        'payapp': 'Pay App',
        'rfi': 'RFI',
        'submittal': 'Submittal',
        'commitment': 'Commitment'
    };
    return typeMap[type] || type;
}

// Get item display content based on type
function getItemDisplayContent(item) {
    let content = '';
    
    switch (item.type) {
        case 'tm':
            content = `
                <p><strong>Employee:</strong> ${highlightSearchTerm(item.employee || 'N/A')}</p>
                <p><strong>Hours:</strong> ${item.hours || 'N/A'}</p>
                <p><strong>Description:</strong> ${highlightSearchTerm(item.description || 'N/A')}</p>
                ${item.materials ? `<p><strong>Materials:</strong> ${highlightSearchTerm(item.materials)}</p>` : ''}
            `;
            break;
        case 'lien':
            content = `
                <p><strong>Vendor:</strong> ${highlightSearchTerm(item.vendor || 'N/A')}</p>
                <p><strong>Amount:</strong> $${item.amount?.toLocaleString() || 'N/A'}</p>
                <p><strong>Release Type:</strong> ${item.releaseType || 'N/A'}</p>
            `;
            break;
        case 'payapp':
            content = `
                <p><strong>Pay App #:</strong> ${highlightSearchTerm(item.payAppNumber || 'N/A')}</p>
                <p><strong>Amount:</strong> $${item.amount?.toLocaleString() || 'N/A'}</p>
                <p><strong>Period Ending:</strong> ${item.periodEnding || 'N/A'}</p>
            `;
            break;
        case 'rfi':
            content = `
                <p><strong>RFI #:</strong> ${highlightSearchTerm(item.rfiNumber || 'N/A')}</p>
                <p><strong>Subject:</strong> ${highlightSearchTerm(item.subject || 'N/A')}</p>
                <p><strong>Priority:</strong> ${item.priority || 'N/A'}</p>
            `;
            break;
        case 'submittal':
            content = `
                <p><strong>Type:</strong> ${item.submittalType || 'N/A'}</p>
                <p><strong>Submittal #:</strong> ${highlightSearchTerm(item.submittalNumber || 'N/A')}</p>
                <p><strong>Description:</strong> ${highlightSearchTerm(item.description || 'N/A')}</p>
            `;
            break;
        case 'commitment':
            content = `
                <p><strong>Subcontractor:</strong> ${highlightSearchTerm(item.subcontractor || 'N/A')}</p>
                <p><strong>Trade:</strong> ${item.trade || 'N/A'}</p>
                <p><strong>Amount:</strong> $${item.contractAmount?.toLocaleString() || 'N/A'}</p>
                <p><strong>Status:</strong> ${item.agreementStatus || 'pending'}</p>
            `;
            break;
    }
    
    if (item.notes) {
        content += `<div class="item-notes"><strong>Notes:</strong> ${highlightSearchTerm(item.notes)}</div>`;
    }
    
    return content;
}

// Modal and Form Functions
function showAddModal(type) {
    const modal = document.getElementById(type + '-modal');
    
    if (!modal) {
        alert('Modal not found for type: ' + type);
        return;
    }
    
    modal.style.display = 'block';
    
    // Reset form
    const form = modal.querySelector('form');
    if (form) {
        form.reset();
        
        // Set default dates
        const today = new Date().toISOString().split('T')[0];
        const nextWeek = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
        
        const dateInputs = form.querySelectorAll('input[name="date"], input[name="initiatedDate"]');
        dateInputs.forEach(input => input.value = today);
        
        const dueDateInputs = form.querySelectorAll('input[name="dueDate"]');
        dueDateInputs.forEach(input => input.value = nextWeek);
    }
}

function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

// Add new item
function addItem(event, type) {
    event.preventDefault();
    
    const form = event.target;
    const formData = new FormData(form);
    
    const item = {
        id: generateId(),
        type: type,
        status: 'pending',
        createdDate: new Date().toISOString(),
        lastContact: null
    };
    
    // Add all form fields to item
    for (let [key, value] of formData.entries()) {
        item[key] = value;
    }
    
    hotTicketItems.push(item);
    saveData();
    renderDashboard();
    closeModal(type + '-modal');
    showNotification(`${getTypeLabel(type)} added successfully!`);
}

// Get type label
function getTypeLabel(type) {
    const labels = {
        'tm': 'T&M Ticket',
        'lien': 'Lien Release',
        'payapp': 'Pay App',
        'rfi': 'RFI',
        'submittal': 'Submittal'
    };
    return labels[type] || type;
}

// Edit item function
function editItem(itemId) {
    const item = hotTicketItems.find(i => i.id === itemId);
    if (!item) return;
    
    showAddModal(item.type);
    
    // Populate form with existing data
    const modal = document.getElementById(item.type + '-modal');
    const form = modal.querySelector('form');
    
    Object.keys(item).forEach(key => {
        const input = form.querySelector(`[name="${key}"]`);
        if (input) {
            input.value = item[key] || '';
        }
    });
    
    // Change form submission to update instead of add
    form.onsubmit = function(event) {
        event.preventDefault();
        updateItem(itemId, event.target);
    };
}

// Update existing item
function updateItem(itemId, form) {
    const formData = new FormData(form);
    const itemIndex = hotTicketItems.findIndex(i => i.id === itemId);
    
    if (itemIndex === -1) return;
    
    // Update item with form data
    for (let [key, value] of formData.entries()) {
        hotTicketItems[itemIndex][key] = value;
    }
    
    hotTicketItems[itemIndex].lastModified = new Date().toISOString();
    
    saveData();
    renderDashboard();
    closeModal(form.closest('.modal').id);
    showNotification('Item updated successfully!');
}

// Mark item as complete
function markComplete(itemId) {
    const itemIndex = hotTicketItems.findIndex(i => i.id === itemId);
    if (itemIndex === -1) return;
    
    hotTicketItems[itemIndex].status = 'completed';
    hotTicketItems[itemIndex].completedDate = new Date().toISOString().split('T')[0];
    
    saveData();
    renderDashboard();
    showNotification('Item marked as complete!');
}

// Log contact function
function logContact(event) {
    event.preventDefault();
    
    const form = event.target;
    const formData = new FormData(form);
    const itemId = document.getElementById('contact-item-id').value;
    
    const contactEntry = {
        id: generateId(),
        itemId: itemId,
        method: formData.get('method'),
        date: formData.get('date'),
        notes: formData.get('notes'),
        timestamp: new Date().toISOString()
    };
    
    contactLog.push(contactEntry);
    
    // Update item's last contact date
    const itemIndex = hotTicketItems.findIndex(i => i.id === itemId);
    if (itemIndex !== -1) {
        hotTicketItems[itemIndex].lastContact = contactEntry.date;
    }
    
    saveData();
    renderDashboard();
    closeModal('contact-modal');
    showNotification('Contact logged successfully!');
}

// Show contact modal for specific item
function showContactModal(itemId) {
    document.getElementById('contact-item-id').value = itemId;
    document.getElementById('contact-modal').style.display = 'block';
    
    // Set default date to today
    const today = new Date().toISOString().split('T')[0];
    document.querySelector('#contact-modal input[name="date"]').value = today;
}

// Enhanced Filter and Search System
let savedFilters = [];
let currentSearchTerm = '';

// Load saved filters from localStorage
function loadSavedFilters() {
    const saved = localStorage.getItem('mhc_saved_filters');
    if (saved) {
        savedFilters = JSON.parse(saved);
        updateSavedFiltersDisplay();
    }
}

// Save current filters
function saveCurrentFilters() {
    const filterName = prompt('Enter a name for this filter set:');
    if (!filterName) return;
    
    const currentFilters = {
        name: filterName,
        search: document.getElementById('search-input').value,
        pm: document.getElementById('pm-filter').value,
        type: document.getElementById('type-filter').value,
        status: document.getElementById('status-filter').value,
        dateFrom: document.getElementById('date-from')?.value || '',
        dateTo: document.getElementById('date-to')?.value || '',
        dueDateFrom: document.getElementById('due-date-from')?.value || '',
        dueDateTo: document.getElementById('due-date-to')?.value || '',
        ballInCourt: document.getElementById('ball-in-court-filter')?.value || '',
        priority: document.getElementById('priority-filter')?.value || '',
        timestamp: new Date().toISOString()
    };
    
    savedFilters.push(currentFilters);
    localStorage.setItem('mhc_saved_filters', JSON.stringify(savedFilters));
    updateSavedFiltersDisplay();
    showNotification(`Filter "${filterName}" saved successfully!`, 'success');
}

// Apply saved filter
function applySavedFilter(filterIndex) {
    const filter = savedFilters[filterIndex];
    if (!filter) return;
    
    document.getElementById('search-input').value = filter.search;
    document.getElementById('pm-filter').value = filter.pm;
    document.getElementById('type-filter').value = filter.type;
    document.getElementById('status-filter').value = filter.status;
    
    if (document.getElementById('date-from')) {
        document.getElementById('date-from').value = filter.dateFrom;
        document.getElementById('date-to').value = filter.dateTo;
        document.getElementById('due-date-from').value = filter.dueDateFrom;
        document.getElementById('due-date-to').value = filter.dueDateTo;
        document.getElementById('ball-in-court-filter').value = filter.ballInCourt;
        document.getElementById('priority-filter').value = filter.priority;
    }
    
    performSearch();
    updateActiveFiltersDisplay();
    showNotification(`Applied filter "${filter.name}"`, 'success');
}

// Delete saved filter
function deleteSavedFilter(filterIndex) {
    if (confirm('Are you sure you want to delete this saved filter?')) {
        savedFilters.splice(filterIndex, 1);
        localStorage.setItem('mhc_saved_filters', JSON.stringify(savedFilters));
        updateSavedFiltersDisplay();
        showNotification('Filter deleted', 'success');
    }
}

// Update saved filters display
function updateSavedFiltersDisplay() {
    const savedFiltersSection = document.getElementById('saved-filters');
    const savedFiltersList = document.getElementById('saved-filters-list');
    
    if (savedFilters.length === 0) {
        savedFiltersSection.style.display = 'none';
        return;
    }
    
    savedFiltersSection.style.display = 'block';
    savedFiltersList.innerHTML = savedFilters.map((filter, index) => `
        <div class="saved-filter-item" onclick="applySavedFilter(${index})">
            <span>${filter.name}</span>
            <span class="delete-filter" onclick="event.stopPropagation(); deleteSavedFilter(${index});">
                <i class="fas fa-times"></i>
            </span>
        </div>
    `).join('');
}

// Toggle advanced filters
function toggleAdvancedFilters() {
    const advancedFilters = document.getElementById('advanced-filters');
    const isVisible = advancedFilters.style.display !== 'none';
    advancedFilters.style.display = isVisible ? 'none' : 'block';
    
    const button = event.target.closest('button');
    const icon = button.querySelector('i');
    icon.className = isVisible ? 'fas fa-sliders-h' : 'fas fa-times';
    button.querySelector('span') ? button.querySelector('span').textContent = isVisible ? ' Advanced' : ' Close' : null;
}

// Clear search
function clearSearch() {
    document.getElementById('search-input').value = '';
    currentSearchTerm = '';
    document.querySelector('.clear-search').style.display = 'none';
    performSearch();
}

// Clear all filters
function clearAllFilters() {
    document.getElementById('search-input').value = '';
    document.getElementById('pm-filter').value = '';
    document.getElementById('type-filter').value = '';
    document.getElementById('status-filter').value = '';
    
    // Clear advanced filters if they exist
    const advancedInputs = ['date-from', 'date-to', 'due-date-from', 'due-date-to', 'ball-in-court-filter', 'priority-filter'];
    advancedInputs.forEach(id => {
        const element = document.getElementById(id);
        if (element) element.value = '';
    });
    
    currentSearchTerm = '';
    document.querySelector('.clear-search').style.display = 'none';
    performSearch();
    updateActiveFiltersDisplay();
    showNotification('All filters cleared', 'success');
}

// Enhanced search with highlighting
function performSearch() {
    currentSearchTerm = document.getElementById('search-input').value.toLowerCase();
    const clearBtn = document.querySelector('.clear-search');
    clearBtn.style.display = currentSearchTerm ? 'block' : 'none';
    
    filterItems();
    updateActiveFiltersDisplay();
}

// Check if date is in range
function isDateInRange(dateStr, fromStr, toStr) {
    if (!fromStr && !toStr) return true;
    
    const date = new Date(dateStr);
    const from = fromStr ? new Date(fromStr) : null;
    const to = toStr ? new Date(toStr) : null;
    
    if (from && date < from) return false;
    if (to && date > to) return false;
    return true;
}

// Enhanced filter function
function filterItems() {
    const searchTerm = document.getElementById('search-input').value.toLowerCase();
    const pmFilter = document.getElementById('pm-filter').value;
    const typeFilter = document.getElementById('type-filter').value;
    const statusFilter = document.getElementById('status-filter').value;
    
    // Advanced filters
    const dateFrom = document.getElementById('date-from')?.value || '';
    const dateTo = document.getElementById('date-to')?.value || '';
    const dueDateFrom = document.getElementById('due-date-from')?.value || '';
    const dueDateTo = document.getElementById('due-date-to')?.value || '';
    const ballInCourtFilter = document.getElementById('ball-in-court-filter')?.value || '';
    const priorityFilter = document.getElementById('priority-filter')?.value || '';
    
    const filteredItems = hotTicketItems.filter(item => {
        const project = projects.find(p => p.id === item.project);
        
        // Enhanced search across all fields
        const matchesSearch = !searchTerm || 
            item.description?.toLowerCase().includes(searchTerm) ||
            item.employee?.toLowerCase().includes(searchTerm) ||
            item.vendor?.toLowerCase().includes(searchTerm) ||
            item.notes?.toLowerCase().includes(searchTerm) ||
            item.materials?.toLowerCase().includes(searchTerm) ||
            item.tools?.toLowerCase().includes(searchTerm) ||
            item.payAppNumber?.toLowerCase().includes(searchTerm) ||
            item.releaseType?.toLowerCase().includes(searchTerm) ||
            item.rfiNumber?.toLowerCase().includes(searchTerm) ||
            item.submittalNumber?.toLowerCase().includes(searchTerm) ||
            item.subcontractor?.toLowerCase().includes(searchTerm) ||
            project?.name?.toLowerCase().includes(searchTerm) ||
            project?.pm?.toLowerCase().includes(searchTerm);
        
        const matchesPM = !pmFilter || project?.pm === pmFilter;
        const matchesType = !typeFilter || item.type === typeFilter;
        const matchesStatus = !statusFilter || getItemStatus(item) === statusFilter;
        
        // Advanced filter matches
        const matchesDateRange = isDateInRange(item.date || item.initiatedDate, dateFrom, dateTo);
        const matchesDueDateRange = isDateInRange(item.dueDate, dueDateFrom, dueDateTo);
        const matchesBallInCourt = !ballInCourtFilter || item.ballInCourt === ballInCourtFilter;
        const matchesPriority = !priorityFilter || item.priority === priorityFilter;
        
        return matchesSearch && matchesPM && matchesType && matchesStatus && 
               matchesDateRange && matchesDueDateRange && matchesBallInCourt && matchesPriority;
    });
    
    renderFilteredItems(filteredItems);
    return filteredItems;
}

// Render filtered items with search highlighting
function renderFilteredItems(filteredItems) {
    const itemsContainer = document.getElementById('items-container');
    if (!itemsContainer) return;

    itemsContainer.innerHTML = '';
    
    if (filteredItems.length === 0) {
        itemsContainer.innerHTML = `
            <div style="text-align: center; padding: 2rem; color: #6b7280;">
                <i class="fas fa-search" style="font-size: 3rem; margin-bottom: 1rem; opacity: 0.5;"></i>
                <p>No items found matching current filters.</p>
                <button class="btn btn-secondary btn-sm" onclick="clearAllFilters()">Clear All Filters</button>
            </div>
        `;
        return;
    }

    filteredItems.forEach(item => {
        const project = projects.find(p => p.id === item.project);
        const itemStatus = getItemStatus(item);
        const daysUntil = getDaysUntilDue(item.dueDate);
        
        let daysText = '';
        if (itemStatus === 'urgent') daysText = `Due ${daysUntil === 0 ? 'today' : 'tomorrow'}!`;
        else if (itemStatus === 'overdue') daysText = `${Math.abs(daysUntil)} days overdue`;
        else if (daysUntil >= 0) daysText = `Due in ${daysUntil} days`;

        const itemCard = document.createElement('div');
        itemCard.className = `item-card ${item.type} ${itemStatus}`;
        itemCard.innerHTML = `
            <div class="item-header">
                <div class="item-title-section">
                    <h4>${getItemTypeDisplay(item.type)}</h4>
                    <p class="item-project">${highlightSearchTerm(project?.name || 'Unknown Project')}</p>
                </div>
                <div class="item-status-section">
                    <span class="item-status ${itemStatus}">${itemStatus.charAt(0).toUpperCase() + itemStatus.slice(1)}</span>
                    ${daysText ? `<span class="days-until">${daysText}</span>` : ''}
                </div>
            </div>
            <div class="item-content">
                ${getItemDisplayContent(item)}
            </div>
            <div class="item-actions">
                <button class="btn btn-sm btn-secondary" onclick="contactItem('${item.id}')">
                    <i class="fas fa-phone"></i> Contact
                </button>
                <button class="btn btn-sm btn-info" onclick="editItem('${item.id}')">
                    <i class="fas fa-edit"></i> Edit
                </button>
                <button class="btn btn-sm btn-primary" onclick="completeItem('${item.id}')">
                    <i class="fas fa-check"></i> Complete
                </button>
            </div>
        `;
        
        itemsContainer.appendChild(itemCard);
    });
}

// Highlight search terms in text
function highlightSearchTerm(text) {
    if (!currentSearchTerm || !text) return text;
    
    const regex = new RegExp(`(${currentSearchTerm})`, 'gi');
    return text.replace(regex, '<span class="search-highlight">$1</span>');
}

// Update active filters display
function updateActiveFiltersDisplay() {
    const activeFiltersSection = document.getElementById('active-filters');
    const activeFiltersTags = document.getElementById('active-filters-tags');
    
    const activeTags = [];
    
    const searchTerm = document.getElementById('search-input').value;
    const pmFilter = document.getElementById('pm-filter').value;
    const typeFilter = document.getElementById('type-filter').value;
    const statusFilter = document.getElementById('status-filter').value;
    
    if (searchTerm) activeTags.push({ type: 'search', value: searchTerm, label: `Search: "${searchTerm}"` });
    if (pmFilter) activeTags.push({ type: 'pm', value: pmFilter, label: `PM: ${pmFilter}` });
    if (typeFilter) activeTags.push({ type: 'type', value: typeFilter, label: `Type: ${getItemTypeDisplay(typeFilter)}` });
    if (statusFilter) activeTags.push({ type: 'status', value: statusFilter, label: `Status: ${statusFilter}` });
    
    // Check advanced filters
    const dateFrom = document.getElementById('date-from')?.value;
    const dateTo = document.getElementById('date-to')?.value;
    const dueDateFrom = document.getElementById('due-date-from')?.value;
    const dueDateTo = document.getElementById('due-date-to')?.value;
    const ballInCourtFilter = document.getElementById('ball-in-court-filter')?.value;
    const priorityFilter = document.getElementById('priority-filter')?.value;
    
    if (dateFrom || dateTo) {
        const dateRange = `${dateFrom || 'start'} to ${dateTo || 'end'}`;
        activeTags.push({ type: 'dateRange', value: '', label: `Date: ${dateRange}` });
    }
    if (dueDateFrom || dueDateTo) {
        const dueDateRange = `${dueDateFrom || 'start'} to ${dueDateTo || 'end'}`;
        activeTags.push({ type: 'dueDateRange', value: '', label: `Due: ${dueDateRange}` });
    }
    if (ballInCourtFilter) activeTags.push({ type: 'ballInCourt', value: ballInCourtFilter, label: `Ball in Court: ${ballInCourtFilter}` });
    if (priorityFilter) activeTags.push({ type: 'priority', value: priorityFilter, label: `Priority: ${priorityFilter}` });
    
    if (activeTags.length === 0) {
        activeFiltersSection.style.display = 'none';
        return;
    }
    
    activeFiltersSection.style.display = 'flex';
    activeFiltersTags.innerHTML = activeTags.map(tag => `
        <div class="filter-tag">
            <span>${tag.label}</span>
            <span class="remove-filter" onclick="removeActiveFilter('${tag.type}', '${tag.value}')">
                <i class="fas fa-times"></i>
            </span>
        </div>
    `).join('');
}

// Remove individual active filter
function removeActiveFilter(type, value) {
    switch (type) {
        case 'search':
            document.getElementById('search-input').value = '';
            clearSearch();
            break;
        case 'pm':
            document.getElementById('pm-filter').value = '';
            break;
        case 'type':
            document.getElementById('type-filter').value = '';
            break;
        case 'status':
            document.getElementById('status-filter').value = '';
            break;
        case 'dateRange':
            if (document.getElementById('date-from')) document.getElementById('date-from').value = '';
            if (document.getElementById('date-to')) document.getElementById('date-to').value = '';
            break;
        case 'dueDateRange':
            if (document.getElementById('due-date-from')) document.getElementById('due-date-from').value = '';
            if (document.getElementById('due-date-to')) document.getElementById('due-date-to').value = '';
            break;
        case 'ballInCourt':
            if (document.getElementById('ball-in-court-filter')) document.getElementById('ball-in-court-filter').value = '';
            break;
        case 'priority':
            if (document.getElementById('priority-filter')) document.getElementById('priority-filter').value = '';
            break;
    }
    
    performSearch();
}

// Excel Export Functions
function exportTeamMeeting() {
    const workbook = XLSX.utils.book_new();
    
    // Group items by PM
    const pmGroups = {
        'Makayla': [],
        'Ben': [],
        'Jeremy': []
    };
    
    hotTicketItems.forEach(item => {
        const project = projects.find(p => p.id === item.project);
        if (project && pmGroups[project.pm]) {
            pmGroups[project.pm].push({
                ...item,
                projectName: project.name,
                pm: project.pm,
                status: getItemStatus(item),
                daysUntilDue: getDaysUntilDue(item.dueDate)
            });
        }
    });
    
    // Create worksheet for each PM
    Object.keys(pmGroups).forEach(pm => {
        const items = pmGroups[pm];
        if (items.length > 0) {
            const wsData = items.map(item => ({
                'Project': item.projectName,
                'Type': getTypeLabel(item.type),
                'Description': item.description || item.vendor || item.payAppNumber || 'N/A',
                'Due Date': item.dueDate,
                'Days Until Due': item.daysUntilDue,
                'Status': item.status,
                'Priority': item.priority,
                'Ball in Court': item.ballInCourt,
                'Notes': item.notes || ''
            }));
            
            const ws = XLSX.utils.json_to_sheet(wsData);
            XLSX.utils.book_append_sheet(workbook, ws, pm);
        }
    });
    
    // Generate filename with current date
    const today = new Date().toISOString().split('T')[0];
    const filename = `MHC_Team_Meeting_${today}.xlsx`;
    
    XLSX.writeFile(workbook, filename);
    showNotification('Team meeting report exported successfully!');
}

function exportBossReport() {
    const workbook = XLSX.utils.book_new();
    
    // Group items by project
    const projectGroups = {};
    
    projects.forEach(project => {
        projectGroups[project.name] = hotTicketItems.filter(item => item.project === project.id)
            .map(item => ({
                ...item,
                projectName: project.name,
                pm: project.pm,
                status: getItemStatus(item),
                daysUntilDue: getDaysUntilDue(item.dueDate)
            }));
    });
    
    // Create worksheet for each project
    Object.keys(projectGroups).forEach(projectName => {
        const items = projectGroups[projectName];
        if (items.length > 0) {
            const wsData = items.map(item => ({
                'PM': item.pm,
                'Type': getTypeLabel(item.type),
                'Description': item.description || item.vendor || item.payAppNumber || 'N/A',
                'Due Date': item.dueDate,
                'Days Until Due': item.daysUntilDue,
                'Status': item.status,
                'Priority': item.priority,
                'Ball in Court': item.ballInCourt,
                'Amount': item.amount || '',
                'Notes': item.notes || ''
            }));
            
            const ws = XLSX.utils.json_to_sheet(wsData);
            XLSX.utils.book_append_sheet(workbook, ws, projectName.substring(0, 31)); // Excel sheet name limit
        }
    });
    
    // Generate filename with current date
    const today = new Date().toISOString().split('T')[0];
    const filename = `MHC_Boss_Report_${today}.xlsx`;
    
    XLSX.writeFile(workbook, filename);
    showNotification('Boss report exported successfully!');
}

// Backup and Restore Functions
function backupData() {
    const backup = {
        hotTicketItems: hotTicketItems,
        projects: projects,
        contactLog: contactLog,
        exportDate: new Date().toISOString(),
        totalItems: hotTicketItems.length,
        version: '1.0'
    };
    
    const dataStr = JSON.stringify(backup, null, 2);
    const dataBlob = new Blob([dataStr], {type: 'application/json'});
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = `MHC_Backup_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    
    showNotification('Data backup downloaded successfully! Save this file to your PC or company server.');
}

// Create a formatted CSV backup for easier reading
function backupDataCSV() {
    let csvContent = "Type,Project,Description,Due Date,Priority,Status,Ball in Court,Created Date,Amount,Contact\n";
    
    hotTicketItems.forEach(item => {
        let description = '';
        let amount = '';
        let contact = '';
        
        // Get type-specific description and fields
        switch (item.type) {
            case 'commitment':
                description = `${item.subcontractor} - ${item.trade} - ${item.workDescription || ''}`.replace(/,/g, ';');
                amount = item.contractAmount || '';
                contact = item.contactPerson || '';
                break;
            case 'lien':
            case 'payapp':
                description = (item.description || item.subject || item.workDescription || '').replace(/,/g, ';');
                amount = item.amount || '';
                break;
            default:
                description = (item.description || item.subject || item.workDescription || '').replace(/,/g, ';');
        }
        
        const row = [
            item.type.toUpperCase(),
            item.project || '',
            description,
            item.dueDate || '',
            item.priority || 'normal',
            getItemStatus(item),
            item.ballInCourt || '',
            item.createdAt || '',
            amount,
            contact
        ].join(',');
        csvContent += row + '\n';
    });
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `MHC_Data_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    
    showNotification('CSV backup downloaded! This file can be opened in Excel.');
}

// Show data storage info
function showDataInfo() {
    const itemCount = hotTicketItems.length;
    const projectCount = projects.length;
    const contactCount = contactLog.length;
    const lastSaved = localStorage.getItem('mhc_lastSaved') || 'Never';
    
    const message = `
        Data Status:
        • ${itemCount} hot ticket items
        • ${projectCount} projects  
        • ${contactCount} contact logs
        • Last saved: ${lastSaved}
        • Storage: Browser localStorage
        
        Backup regularly to save to PC & company server!
    `;
    
    alert(message);
}

function restoreData(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const backup = JSON.parse(e.target.result);
            
            if (backup.hotTicketItems) hotTicketItems = backup.hotTicketItems;
            if (backup.projects) projects = backup.projects;
            if (backup.contactLog) contactLog = backup.contactLog;
            
            saveData();
            renderDashboard();
            showNotification('Data restored successfully!');
        } catch (error) {
            showNotification('Error restoring data. Please check the file format.', 'error');
        }
    };
    reader.readAsText(file);
}

// Project Management Functions
function openProjectEditor(projectId) {
    const project = projects.find(p => p.id === projectId);
    if (!project) {
        showNotification('Project not found', 'error');
        return;
    }
    
    // Populate form fields
    document.getElementById('edit-project-id').value = project.id;
    document.getElementById('edit-project-name').value = project.name || '';
    document.getElementById('edit-project-pm').value = project.pm || '';
    document.getElementById('edit-project-status').value = project.status || 'active';
    document.getElementById('edit-project-key').value = project.id || '';
    document.getElementById('edit-project-start-date').value = project.startDate || '';
    document.getElementById('edit-project-end-date').value = project.endDate || '';
    document.getElementById('edit-project-description').value = project.description || '';
    document.getElementById('edit-project-notes').value = project.notes || '';
    
    // Show modal
    document.getElementById('project-edit-modal').style.display = 'block';
}

function saveProject(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const projectId = formData.get('projectId');
    
    const updatedProject = {
        id: projectId,
        name: formData.get('name'),
        pm: formData.get('pm'),
        status: formData.get('status'),
        startDate: formData.get('startDate'),
        endDate: formData.get('endDate'),
        description: formData.get('description'),
        notes: formData.get('notes')
    };
    
    // Find and update the project
    const projectIndex = projects.findIndex(p => p.id === projectId);
    if (projectIndex === -1) {
        showNotification('Project not found', 'error');
        return;
    }
    
    // Preserve the original ID and merge with updates
    projects[projectIndex] = { ...projects[projectIndex], ...updatedProject };
    
    // Save to localStorage
    saveData();
    
    // Update the dropdown options in all forms if PM changed
    updateProjectDropdowns();
    
    // Re-render the dashboard
    renderDashboard();
    
    // Close modal and show success message
    closeModal('project-edit-modal');
    showNotification('Project updated successfully!', 'success');
}

function updateProjectDropdowns() {
    // Update all project dropdowns in forms
    const projectSelects = document.querySelectorAll('select[name="project"]');
    
    projectSelects.forEach(select => {
        const currentValue = select.value;
        select.innerHTML = '<option value="">Select Project</option>';
        
        projects.forEach(project => {
            const option = document.createElement('option');
            option.value = project.id;
            option.textContent = `${project.pm} - ${project.name}`;
            if (project.status !== 'active') {
                option.textContent += ` (${project.status})`;
                option.disabled = project.status === 'completed' || project.status === 'cancelled';
            }
            select.appendChild(option);
        });
        
        // Restore previous selection if it still exists
        if (currentValue) {
            select.value = currentValue;
        }
    });
}

// Notification system
function showNotification(message, type = 'success') {
    const notification = document.getElementById('notification');
    const messageElement = document.getElementById('notification-message');
    
    messageElement.textContent = message;
    notification.className = `notification ${type}`;
    notification.style.display = 'flex';
    
    setTimeout(() => {
        hideNotification();
    }, 5000);
}

function hideNotification() {
    document.getElementById('notification').style.display = 'none';
}

// Close modals when clicking outside
window.onclick = function(event) {
    if (event.target.classList.contains('modal')) {
        event.target.style.display = 'none';
    }
}

console.log("MHC Project Tracker loaded successfully");
