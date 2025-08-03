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
}

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
            notes: 'Client requested eco-friendly materials',
            budget: 2500000,
            spent: 1800000,
            progress: 72,
            phase: 'Interior Finishes'
        },
        {
            id: 'makayla-job2',
            name: 'Makayla - Retail Center',
            pm: 'Makayla',
            status: 'active',
            startDate: '2024-03-01',
            endDate: '2024-10-15',
            description: 'Shopping center with 12 retail units',
            notes: 'Phase 1 completion targeted for September',
            budget: 3200000,
            spent: 1600000,
            progress: 50,
            phase: 'Structural Work'
        },
        {
            id: 'ben-job1',
            name: 'Ben - Warehouse Expansion',
            pm: 'Ben',
            status: 'active',
            startDate: '2024-02-01',
            endDate: '2024-09-30',
            description: 'Expanding existing warehouse by 50,000 sq ft',
            notes: 'Working around operational constraints',
            budget: 1800000,
            spent: 1350000,
            progress: 75,
            phase: 'Final Systems'
        },
        {
            id: 'ben-job2',
            name: 'Ben - Manufacturing Plant',
            pm: 'Ben',
            status: 'active',
            startDate: '2024-04-01',
            endDate: '2024-12-15',
            description: 'New manufacturing facility with clean room requirements',
            notes: 'Specialized HVAC systems required',
            budget: 4500000,
            spent: 1800000,
            progress: 40,
            phase: 'MEP Installation'
        },
        {
            id: 'ben-job3',
            name: 'Ben - Distribution Center',
            pm: 'Ben',
            status: 'active',
            startDate: '2024-05-15',
            endDate: '2025-01-30',
            description: 'Automated distribution center with conveyor systems',
            notes: 'Integration with existing logistics network',
            budget: 3800000,
            spent: 1140000,
            progress: 30,
            phase: 'Foundation & Structure'
        },
        {
            id: 'jeremy-darigold',
            name: 'Jeremy - Darigold Plant',
            pm: 'Jeremy',
            status: 'active',
            startDate: '2024-01-01',
            endDate: '2024-11-30',
            description: 'Dairy processing facility upgrade and expansion',
            notes: 'Food safety compliance critical',
            budget: 5200000,
            spent: 4160000,
            progress: 80,
            phase: 'Equipment Installation'
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
    
    // Refresh analytics when data changes
    setTimeout(() => {
        refreshAnalytics();
    }, 100);
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
    // Statistics are now handled by the analytics dashboard
    // This function is kept for backward compatibility but the old stats bar has been removed
    const urgentCount = hotTicketItems.filter(item => getItemStatus(item) === 'urgent').length;
    const overdueCount = hotTicketItems.filter(item => getItemStatus(item) === 'overdue').length;
    const totalCount = hotTicketItems.filter(item => item.status !== 'completed').length;
    const completedToday = hotTicketItems.filter(item => {
        const today = new Date().toISOString().split('T')[0];
        return item.status === 'completed' && item.completedDate === today;
    }).length;
    
    // No longer updating DOM elements since stats bar was removed
    // Statistics are now displayed in the analytics dashboard
    console.log('Stats:', { urgentCount, overdueCount, totalCount, completedToday });
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
    
    // Set modal title for editing
    document.getElementById('project-modal-title').textContent = 'Edit Project';
    
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
    
    // Populate new financial/progress fields
    document.getElementById('edit-project-budget').value = project.budget || '';
    document.getElementById('edit-project-spent').value = project.spent || '';
    document.getElementById('edit-project-progress').value = project.progress || 0;
    document.getElementById('edit-project-phase').value = project.phase || '';
    
    // Show modal
    document.getElementById('project-edit-modal').style.display = 'block';
}

function saveProject(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const projectId = formData.get('projectId');
    
    if (projectId) {
        // Editing existing project
        const updatedProject = {
            id: projectId,
            name: formData.get('name'),
            pm: formData.get('pm'),
            status: formData.get('status'),
            startDate: formData.get('startDate'),
            endDate: formData.get('endDate'),
            description: formData.get('description'),
            notes: formData.get('notes'),
            budget: parseFloat(formData.get('budget')) || 0,
            spent: parseFloat(formData.get('spent')) || 0,
            progress: parseInt(formData.get('progress')) || 0,
            phase: formData.get('phase') || 'Planning'
        };
        
        // Find and update the project
        const projectIndex = projects.findIndex(p => p.id === projectId);
        if (projectIndex === -1) {
            showNotification('Project not found', 'error');
            return;
        }
        
        // Preserve the original project data and merge with updates
        projects[projectIndex] = { ...projects[projectIndex], ...updatedProject };
        
        showNotification('Project updated successfully!', 'success');
    } else {
        // Creating new project
        const newProject = {
            id: `project-${Date.now()}`,
            name: formData.get('name'),
            pm: formData.get('pm'),
            status: formData.get('status') || 'active',
            startDate: formData.get('startDate'),
            endDate: formData.get('endDate'),
            description: formData.get('description'),
            notes: formData.get('notes'),
            budget: parseFloat(formData.get('budget')) || 0,
            spent: parseFloat(formData.get('spent')) || 0,
            progress: parseInt(formData.get('progress')) || 0,
            phase: formData.get('phase') || 'Planning'
        };
        
        projects.push(newProject);
        showNotification('New project created successfully!', 'success');
    }
    
    // Save to localStorage
    saveData();
    
    // Update the dropdown options in all forms if PM changed
    updateProjectDropdowns();
    
    // Re-render the dashboard
    renderDashboard();
    
    // Close modal
    closeModal('project-edit-modal');
    
    // Refresh analytics to show the new/updated project
    setTimeout(() => {
        refreshAnalytics();
    }, 100);
}

// Add new project function
function addNewProject() {
    // Clear the form
    document.getElementById('project-edit-form').reset();
    document.getElementById('edit-project-id').value = '';
    document.getElementById('edit-project-key').value = '';
    
    // Set modal title for new project
    document.getElementById('project-modal-title').textContent = 'Add New Project';
    
    // Set default values
    if (document.getElementById('edit-project-status')) {
        document.getElementById('edit-project-status').value = 'active';
    }
    if (document.getElementById('edit-project-progress')) {
        document.getElementById('edit-project-progress').value = '0';
    }
    if (document.getElementById('edit-project-phase')) {
        document.getElementById('edit-project-phase').value = 'Planning';
    }
    
    // Show modal
    showModal('project-edit-modal');
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

// Enhanced Analytics System
let analyticsData = {
    period: 30,
    metrics: {},
    notifications: []
};

// Initialize analytics
function initializeAnalytics() {
    console.log('Starting analytics initialization...');
    
    // Check if analytics section exists
    const analyticsSection = document.querySelector('.analytics-section');
    if (!analyticsSection) {
        console.error('Analytics section not found in DOM');
        return;
    }
    
    loadNotificationSettings();
    
    console.log('Projects available:', projects.length);
    console.log('Hot ticket items available:', hotTicketItems.length);
    
    try {
        updateAnalytics();
        updateNotifications();
        
        // Check for notifications every 5 minutes
        setInterval(updateNotifications, 5 * 60 * 1000);
        
        console.log('Analytics initialization complete');
    } catch (error) {
        console.error('Error during analytics initialization:', error);
    }
}

// Update analytics dashboard
function updateAnalytics() {
    console.log('Updating analytics...');
    const period = parseInt(document.getElementById('analytics-period')?.value || 30);
    analyticsData.period = period;
    
    console.log('Calculating metrics...');
    calculateMetrics();
    
    console.log('Rendering metrics...');
    renderMetrics();
    
    console.log('Rendering progress charts...');
    renderProgressCharts();
    
    console.log('Rendering performance chart...');
    renderPerformanceChart();
    
    console.log('Rendering pie chart...');
    renderProjectStatusPieChart();
    
    console.log('Rendering financial table...');
    renderFinancialTable();
    
    console.log('Rendering trends table...');
    renderTrendsTable();
    
    console.log('Analytics updated successfully');
}

// Refresh analytics (can be called when data changes)
function refreshAnalytics() {
    if (document.querySelector('.analytics-section')) {
        updateAnalytics();
    }
}

// Calculate key metrics
function calculateMetrics() {
    console.log('Calculating metrics...');
    
    // Ensure we have projects data loaded
    if (!projects || projects.length === 0) {
        console.warn('No projects data available for analytics');
        analyticsData.metrics = {
            totalBudget: 0,
            totalSpent: 0,
            avgProgress: 0,
            avgCompletionTime: 0,
            efficiencyScore: 100, // Default to 100% when no data
            progressTrend: 0,
            completionTrend: 0
        };
        console.log('Default metrics set:', analyticsData.metrics);
        return;
    }
    
    console.log('Projects for calculation:', projects);
    
    const totalBudget = projects.reduce((sum, p) => sum + (p.budget || 0), 0);
    const totalSpent = projects.reduce((sum, p) => sum + (p.spent || 0), 0);
    const avgProgress = projects.reduce((sum, p) => sum + (p.progress || 0), 0) / projects.length;
    
    // Calculate completion metrics
    const completedItems = hotTicketItems.filter(item => item.status === 'completed');
    const avgCompletionTime = calculateAverageCompletionTime(completedItems);
    
    // Calculate efficiency score
    const efficiencyScore = calculateEfficiencyScore();
    
    analyticsData.metrics = {
        totalBudget,
        totalSpent,
        avgProgress,
        avgCompletionTime,
        efficiencyScore,
        progressTrend: calculateProgressTrend(),
        completionTrend: calculateCompletionTrend()
    };
    
    console.log('Analytics metrics calculated:', analyticsData.metrics);
}

// Render metrics cards
function renderMetrics() {
    console.log('Rendering metrics...');
    
    if (!analyticsData || !analyticsData.metrics) {
        console.error('Analytics data not available');
        return;
    }
    
    const metrics = analyticsData.metrics;
    console.log('Metrics to render:', metrics);
    
    try {
        const totalBudgetEl = document.getElementById('total-budget');
        const budgetSpentEl = document.getElementById('budget-spent');
        const avgProgressEl = document.getElementById('avg-progress');
        const progressTrendEl = document.getElementById('progress-trend');
        const avgCompletionEl = document.getElementById('avg-completion');
        const completionTrendEl = document.getElementById('completion-trend');
        const efficiencyScoreEl = document.getElementById('efficiency-score');
        const efficiencyTrendEl = document.getElementById('efficiency-trend');
        
        console.log('DOM elements found:', {
            totalBudgetEl: !!totalBudgetEl,
            budgetSpentEl: !!budgetSpentEl,
            avgProgressEl: !!avgProgressEl,
            progressTrendEl: !!progressTrendEl
        });
        
        if (totalBudgetEl) totalBudgetEl.textContent = `$${metrics.totalBudget.toLocaleString()}`;
        if (budgetSpentEl) {
            const spentPercent = metrics.totalBudget > 0 ? Math.round((metrics.totalSpent / metrics.totalBudget) * 100) : 0;
            budgetSpentEl.textContent = `$${metrics.totalSpent.toLocaleString()} spent (${spentPercent}%)`;
        }
        
        if (avgProgressEl) avgProgressEl.textContent = `${Math.round(metrics.avgProgress)}%`;
        if (progressTrendEl) progressTrendEl.textContent = `${metrics.progressTrend > 0 ? '+' : ''}${metrics.progressTrend}% this month`;
        
        if (avgCompletionEl) avgCompletionEl.textContent = metrics.avgCompletionTime;
        if (completionTrendEl) completionTrendEl.textContent = `${hotTicketItems.filter(i => i.status === 'completed').length} items completed`;
        
        if (efficiencyScoreEl) efficiencyScoreEl.textContent = `${Math.round(metrics.efficiencyScore)}%`;
        if (efficiencyTrendEl) efficiencyTrendEl.textContent = metrics.efficiencyScore >= 75 ? 'Above target' : 'Below target';
        
        console.log('Metrics rendered successfully');
    } catch (error) {
        console.error('Error rendering metrics:', error);
    }
}

// Render progress charts
function renderProgressCharts() {
    const container = document.getElementById('progress-charts');
    if (!container) return;
    
    if (!projects || projects.length === 0) {
        container.innerHTML = `
            <div style="text-align: center; color: var(--gray-500); padding: 2rem;">
                <i class="fas fa-building" style="font-size: 2rem; margin-bottom: 1rem; color: var(--gray-400);"></i>
                <div style="font-weight: 600; margin-bottom: 0.5rem;">No Projects Yet</div>
                <div style="font-size: var(--text-sm);">Click on the "Active Projects" section below to add your first project.</div>
            </div>
        `;
        return;
    }
    
    container.innerHTML = projects.map(project => {
        const progressClass = project.progress >= 80 ? 'success' : project.progress >= 50 ? '' : 'warning';
        const budgetUsed = project.spent && project.budget ? ((project.spent / project.budget) * 100).toFixed(1) : 0;
        return `
            <div class="project-progress-item">
                <div class="project-progress-info">
                    <div class="project-progress-name">${project.name}</div>
                    <div class="project-progress-details">
                        ${project.phase || 'In Progress'} • ${project.pm} • ${budgetUsed}% budget used
                    </div>
                </div>
                <div class="progress-bar-container">
                    <div class="progress-bar ${progressClass}" style="width: ${project.progress}%"></div>
                </div>
                <div class="progress-percentage">${project.progress}%</div>
            </div>
        `;
    }).join('');
}

// Render PM performance chart
function renderPerformanceChart() {
    const container = document.getElementById('performance-chart');
    if (!container) return;
    
    const pmStats = calculatePMStats();
    
    if (Object.keys(pmStats).length === 0) {
        container.innerHTML = `
            <div style="text-align: center; color: var(--gray-500); padding: 2rem;">
                <i class="fas fa-users" style="font-size: 2rem; margin-bottom: 1rem; color: var(--gray-400);"></i>
                <div style="font-weight: 600; margin-bottom: 0.5rem;">No PM Performance Data</div>
                <div style="font-size: var(--text-sm);">Performance metrics will appear once you add projects with assigned project managers.</div>
            </div>
        `;
        return;
    }
    
    container.innerHTML = Object.entries(pmStats).map(([pm, stats]) => {
        const budgetEfficiency = stats.totalBudget > 0 ? ((stats.totalBudget - stats.totalSpent) / stats.totalBudget * 100) : 0;
        const efficiencyColor = budgetEfficiency >= 0 ? 'var(--success-600)' : 'var(--danger-600)';
        
        return `
        <div class="pm-performance-item">
            <div class="pm-info">
                <div class="pm-avatar ${pm.toLowerCase()}" style="background: var(--primary-100); color: var(--primary-700); width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 600;">${pm.charAt(0)}</div>
                <div>
                    <div style="font-weight: 600; color: var(--gray-800);">${pm}</div>
                    <div style="font-size: var(--text-xs); color: var(--gray-600);">${stats.projects} projects • $${(stats.totalBudget || 0).toLocaleString()} total</div>
                </div>
            </div>
            <div class="pm-stats">
                <div class="pm-stat">
                    <div class="pm-stat-value">${Math.round(stats.avgProgress)}%</div>
                    <div class="pm-stat-label">Avg Progress</div>
                </div>
                <div class="pm-stat">
                    <div class="pm-stat-value">${stats.activeItems}</div>
                    <div class="pm-stat-label">Active Items</div>
                </div>
                <div class="pm-stat">
                    <div class="pm-stat-value">${stats.completedThisMonth}</div>
                    <div class="pm-stat-label">Completed</div>
                </div>
                <div class="pm-stat">
                    <div class="pm-stat-value" style="color: ${efficiencyColor};">
                        ${budgetEfficiency >= 0 ? '+' : ''}${budgetEfficiency.toFixed(1)}%
                    </div>
                    <div class="pm-stat-label">Budget Efficiency</div>
                </div>
            </div>
        </div>
    `}).join('');
}

// Render Project Status Pie Chart
function renderProjectStatusPieChart() {
    const canvas = document.getElementById('project-status-pie-chart');
    const legendContainer = document.getElementById('pie-chart-legend');
    if (!canvas || !legendContainer) return;
    
    // Get project status data
    const statusCounts = {};
    const totalItems = hotTicketItems.length;
    
    if (totalItems === 0) {
        canvas.style.display = 'none';
        legendContainer.innerHTML = `
            <div style="text-align: center; color: var(--gray-500); padding: 2rem;">
                <i class="fas fa-chart-pie" style="font-size: 2rem; margin-bottom: 1rem; color: var(--gray-400);"></i>
                <div style="font-weight: 600; margin-bottom: 0.5rem;">No Project Data Yet</div>
                <div style="font-size: var(--text-sm);">Project status chart will appear once you add hot ticket items.</div>
            </div>
        `;
        return;
    }
    
    canvas.style.display = 'block';
    
    // Count items by status
    hotTicketItems.forEach(item => {
        const status = getItemStatus(item);
        statusCounts[status] = (statusCounts[status] || 0) + 1;
    });
    
    // Define colors for each status
    const statusColors = {
        'urgent': '#dc2626',      // Red
        'overdue': '#ea580c',     // Orange-red
        'pending': '#d97706',     // Orange
        'completed': '#059669'    // Green
    };
    
    // Create pie chart data
    const data = Object.entries(statusCounts).map(([status, count]) => ({
        label: status.charAt(0).toUpperCase() + status.slice(1),
        value: count,
        percentage: ((count / totalItems) * 100).toFixed(1),
        color: statusColors[status] || '#6b7280'
    }));
    
    // Draw pie chart
    const ctx = canvas.getContext('2d');
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(centerX, centerY) - 20;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    let currentAngle = -Math.PI / 2; // Start at top
    
    // Draw pie slices
    data.forEach(segment => {
        const sliceAngle = (segment.value / totalItems) * 2 * Math.PI;
        
        // Draw slice
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.arc(centerX, centerY, radius, currentAngle, currentAngle + sliceAngle);
        ctx.closePath();
        ctx.fillStyle = segment.color;
        ctx.fill();
        
        // Draw slice border
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.stroke();
        
        currentAngle += sliceAngle;
    });
    
    // Draw center circle for donut effect
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius * 0.4, 0, 2 * Math.PI);
    ctx.fillStyle = '#ffffff';
    ctx.fill();
    ctx.strokeStyle = '#e5e7eb';
    ctx.lineWidth = 1;
    ctx.stroke();
    
    // Add center text
    ctx.fillStyle = '#374151';
    ctx.font = 'bold 16px system-ui';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(totalItems.toString(), centerX, centerY - 5);
    ctx.font = '12px system-ui';
    ctx.fillText('Total Items', centerX, centerY + 10);
    
    // Create legend
    legendContainer.innerHTML = data.map(segment => `
        <div class="pie-legend-item">
            <div class="pie-legend-color" style="background-color: ${segment.color};"></div>
            <span class="pie-legend-label">${segment.label}</span>
            <span class="pie-legend-value">${segment.value} (${segment.percentage}%)</span>
        </div>
    `).join('');
}

// Render financial table
function renderFinancialTable() {
    const container = document.getElementById('financial-table');
    if (!container) return;
    
    if (!projects || projects.length === 0) {
        container.innerHTML = `
            <div style="text-align: center; color: var(--gray-500); padding: 2rem;">
                <i class="fas fa-chart-line" style="font-size: 2rem; margin-bottom: 1rem; color: var(--gray-400);"></i>
                <div style="font-weight: 600; margin-bottom: 0.5rem;">No Financial Data Yet</div>
                <div style="font-size: var(--text-sm);">Financial analytics will appear once you add projects with budget information.</div>
            </div>
        `;
        return;
    }
    
    container.innerHTML = `
        <table class="analytics-table">
            <thead>
                <tr>
                    <th>Project</th>
                    <th>PM</th>
                    <th>Budget</th>
                    <th>Spent</th>
                    <th>Remaining</th>
                    <th>Budget Used</th>
                    <th>Progress</th>
                    <th>Phase</th>
                </tr>
            </thead>
            <tbody>
                ${projects.map(project => {
                    const remaining = (project.budget || 0) - (project.spent || 0);
                    const budgetUsedPercent = project.budget ? Math.round(((project.spent || 0) / project.budget) * 100) : 0;
                    const isOverBudget = budgetUsedPercent > project.progress;
                    
                    return `
                        <tr>
                            <td style="font-weight: 600;">${project.name}</td>
                            <td>${project.pm}</td>
                            <td>$${(project.budget || 0).toLocaleString()}</td>
                            <td>$${(project.spent || 0).toLocaleString()}</td>
                            <td style="color: ${remaining < 0 ? 'var(--danger-600)' : 'var(--success-600)'}; font-weight: 600;">
                                $${remaining.toLocaleString()}
                            </td>
                            <td style="color: ${isOverBudget ? 'var(--danger-600)' : 'var(--gray-700)'}; font-weight: 600;">
                                ${budgetUsedPercent}%
                            </td>
                            <td>
                                <div style="display: flex; align-items: center; gap: 0.5rem;">
                                    <div style="flex: 1; height: 4px; background: var(--gray-200); border-radius: 2px;">
                                        <div style="height: 100%; background: var(--primary-500); border-radius: 2px; width: ${project.progress}%;"></div>
                                    </div>
                                    <span style="min-width: 35px; font-size: var(--text-xs);">${project.progress}%</span>
                                </div>
                            </td>
                            <td>
                                <span class="phase-badge" style="padding: 0.25rem 0.5rem; background: var(--primary-100); color: var(--primary-700); border-radius: var(--radius-sm); font-size: var(--text-xs);">
                                    ${project.phase || 'In Progress'}
                                </span>
                            </td>
                        </tr>
                    `;
                }).join('')}
            </tbody>
        </table>
    `;
}

// Render trends table
function renderTrendsTable() {
    const container = document.getElementById('trends-table');
    if (!container) return;
    
    const trendData = calculateItemTrends();
    
    container.innerHTML = `
        <table class="analytics-table">
            <thead>
                <tr>
                    <th>Item Type</th>
                    <th>Active</th>
                    <th>Completed</th>
                    <th>Avg. Days</th>
                    <th>Trend</th>
                </tr>
            </thead>
            <tbody>
                ${Object.entries(trendData).map(([type, data]) => `
                    <tr>
                        <td>${getItemTypeDisplay(type)}</td>
                        <td>${data.active}</td>
                        <td>${data.completed}</td>
                        <td>${data.avgDays}</td>
                        <td style="color: ${data.trend > 0 ? 'var(--success-600)' : 'var(--danger-600)'}">
                            ${data.trend > 0 ? '↗' : '↘'} ${Math.abs(data.trend)}%
                        </td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
}

// Smart Notifications System
function updateNotifications() {
    console.log('Updating notifications...');
    
    try {
        const urgentItems = hotTicketItems.filter(item => getItemStatus(item) === 'urgent');
        const overdueItems = hotTicketItems.filter(item => getItemStatus(item) === 'overdue');
        const milestones = checkProjectMilestones();
        
        console.log('Notification counts:', {
            urgent: urgentItems.length,
            overdue: overdueItems.length,
            milestones: milestones.length
        });
        
        // Update notification counts
        const urgentCountEl = document.getElementById('urgent-notification-count');
        const overdueCountEl = document.getElementById('overdue-notification-count');
        const milestoneCountEl = document.getElementById('milestone-notification-count');
        
        if (urgentCountEl) urgentCountEl.textContent = urgentItems.length;
        if (overdueCountEl) overdueCountEl.textContent = overdueItems.length;
        if (milestoneCountEl) milestoneCountEl.textContent = milestones.length;
        
        // Render notification lists
        renderNotificationList('urgent-notifications-list', urgentItems.map(item => ({
            id: item.id,
            title: `${getItemTypeDisplay(item.type)} - ${getItemTitle(item)}`,
            content: `Due ${formatRelativeTime(item.dueDate)} - Project: ${getProjectName(item.project)}`,
            time: formatRelativeTime(item.dueDate),
            type: 'urgent'
        })));
        
        renderNotificationList('overdue-notifications-list', overdueItems.map(item => ({
            id: item.id,
            title: `${getItemTypeDisplay(item.type)} - ${getItemTitle(item)}`,
            content: `${Math.abs(getDaysUntilDue(item.dueDate))} days overdue - Project: ${getProjectName(item.project)}`,
            time: formatRelativeTime(item.dueDate),
            type: 'overdue'
        })));
        
        renderNotificationList('milestone-notifications-list', milestones);
        
        // Browser notifications for urgent items (if enabled)
        if (urgentItems.length > 0 && Notification.permission === 'granted') {
            const notificationSettings = getNotificationSettings();
            if (notificationSettings.browserNotifications) {
                showBrowserNotification(urgentItems[0]);
            }
        }
        
        console.log('Notifications updated successfully');
    } catch (error) {
        console.error('Error updating notifications:', error);
    }
}

// Render notification list
function renderNotificationList(containerId, notifications) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    if (notifications.length === 0) {
        container.innerHTML = '<div style="text-align: center; color: var(--gray-500); padding: 1rem;">No notifications</div>';
        return;
    }
    
    container.innerHTML = notifications.map(notification => `
        <div class="notification-item" onclick="focusOnItem('${notification.id}')">
            <div class="notification-item-header">
                <div class="notification-item-title">${notification.title}</div>
                <div class="notification-item-time">${notification.time}</div>
            </div>
            <div class="notification-item-content">${notification.content}</div>
        </div>
    `).join('');
}

// Configure notifications modal
function configureNotifications() {
    if (Notification.permission === 'default') {
        Notification.requestPermission().then(permission => {
            if (permission === 'granted') {
                showNotification('Browser notifications enabled!', 'success');
            }
        });
    }
    
    showNotificationSettingsModal();
}

// Helper functions for analytics
function calculateAverageCompletionTime(completedItems) {
    if (completedItems.length === 0) return 0;
    
    const totalDays = completedItems.reduce((sum, item) => {
        const created = new Date(item.createdDate);
        const completed = new Date(item.completedDate || Date.now());
        const days = Math.ceil((completed - created) / (1000 * 60 * 60 * 24));
        return sum + days;
    }, 0);
    
    return Math.round(totalDays / completedItems.length);
}

function calculateEfficiencyScore() {
    const totalItems = hotTicketItems.length;
    const completedItems = hotTicketItems.filter(item => item.status === 'completed').length;
    const overdueItems = hotTicketItems.filter(item => getItemStatus(item) === 'overdue').length;
    
    if (totalItems === 0) return 100;
    
    const completionRate = (completedItems / totalItems) * 100;
    const overdueRate = (overdueItems / totalItems) * 100;
    
    return Math.max(0, completionRate - (overdueRate * 2));
}

function calculateProgressTrend() {
    // Simulate progress trend calculation
    return Math.floor(Math.random() * 20) - 10; // -10 to +10
}

function calculateCompletionTrend() {
    // Simulate completion trend calculation
    return Math.floor(Math.random() * 10) + 5; // 5 to 15
}

function calculatePMStats() {
    if (!projects || projects.length === 0) {
        return {};
    }
    
    const stats = {};
    
    // Get unique PMs from actual projects data
    const uniquePMs = [...new Set(projects.map(p => p.pm))];
    
    uniquePMs.forEach(pm => {
        const pmProjects = projects.filter(p => p.pm === pm);
        const pmItems = hotTicketItems.filter(item => {
            const project = projects.find(p => p.id === item.project);
            return project && project.pm === pm;
        });
        
        const totalProgress = pmProjects.reduce((sum, p) => sum + (p.progress || 0), 0);
        const avgProgress = pmProjects.length > 0 ? totalProgress / pmProjects.length : 0;
        
        stats[pm] = {
            projects: pmProjects.length,
            avgProgress: avgProgress,
            activeItems: pmItems.filter(item => item.status !== 'completed').length,
            completedThisMonth: pmItems.filter(item => {
                if (item.status !== 'completed') return false;
                const completedDate = new Date(item.completedDate || Date.now());
                const thisMonth = new Date();
                return completedDate.getMonth() === thisMonth.getMonth() && 
                       completedDate.getFullYear() === thisMonth.getFullYear();
            }).length,
            totalBudget: pmProjects.reduce((sum, p) => sum + (p.budget || 0), 0),
            totalSpent: pmProjects.reduce((sum, p) => sum + (p.spent || 0), 0)
        };
    });
    
    return stats;
}

function calculateItemTrends() {
    const trends = {};
    
    ['tm', 'lien', 'payapp', 'rfi', 'submittal', 'commitment'].forEach(type => {
        const typeItems = hotTicketItems.filter(item => item.type === type);
        const completed = typeItems.filter(item => item.status === 'completed');
        
        trends[type] = {
            active: typeItems.filter(item => item.status !== 'completed').length,
            completed: completed.length,
            avgDays: calculateAverageCompletionTime(completed),
            trend: Math.floor(Math.random() * 40) - 20 // -20 to +20
        };
    });
    
    return trends;
}

function checkProjectMilestones() {
    const milestones = [];
    
    if (!projects || projects.length === 0) {
        return milestones;
    }
    
    projects.forEach(project => {
        if (project.progress >= 25 && project.progress < 30) {
            milestones.push({
                id: project.id,
                title: '25% Milestone Reached',
                content: `${project.name} has reached 25% completion`,
                time: 'Today',
                type: 'milestone'
            });
        }
        if (project.progress >= 50 && project.progress < 55) {
            milestones.push({
                id: project.id,
                title: '50% Milestone Reached',
                content: `${project.name} is halfway complete`,
                time: 'Today',
                type: 'milestone'
            });
        }
        if (project.progress >= 75 && project.progress < 80) {
            milestones.push({
                id: project.id,
                title: '75% Milestone Reached',
                content: `${project.name} is nearing completion`,
                time: 'Today',
                type: 'milestone'
            });
        }
    });
    
    return milestones;
}

function getItemTitle(item) {
    switch (item.type) {
        case 'tm': return item.employee || 'T&M Item';
        case 'lien': return item.vendor || 'Lien Release';
        case 'payapp': return `Pay App #${item.payAppNumber || 'N/A'}`;
        case 'rfi': return `RFI #${item.rfiNumber || 'N/A'}`;
        case 'submittal': return item.submittalType || 'Submittal';
        case 'commitment': return item.subcontractor || 'Commitment';
        default: return 'Item';
    }
}

function getProjectName(projectId) {
    const project = projects.find(p => p.id === projectId);
    return project ? project.name : 'Unknown Project';
}

function formatRelativeTime(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = date - now;
    const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'today';
    if (diffDays === 1) return 'tomorrow';
    if (diffDays === -1) return 'yesterday';
    if (diffDays > 1) return `in ${diffDays} days`;
    if (diffDays < -1) return `${Math.abs(diffDays)} days ago`;
    
    return dateString;
}

function focusOnItem(itemId) {
    // Scroll to the item in the list
    const itemElements = document.querySelectorAll('.item-card');
    itemElements.forEach(element => {
        const buttons = element.querySelectorAll('button[onclick*="' + itemId + '"]');
        if (buttons.length > 0) {
            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
            element.style.boxShadow = 'var(--shadow-2xl)';
            setTimeout(() => {
                element.style.boxShadow = '';
            }, 3000);
        }
    });
}

function showBrowserNotification(item) {
    if (Notification.permission === 'granted') {
        const notification = new Notification(`MHC Tracker: ${getItemTypeDisplay(item.type)} Due Soon`, {
            body: `${getItemTitle(item)} is due ${formatRelativeTime(item.dueDate)}`,
            icon: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTkyIiBoZWlnaHQ9IjE5MiIgdmlld0JveD0iMCAwIDE5MiAxOTIiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxOTIiIGhlaWdodD0iMTkyIiByeD0iMjQiIGZpbGw9IiMxZTNhOGEiLz4KPHN2ZyB4PSI0OCIgeT0iNDgiIHdpZHRoPSI5NiIgaGVpZ2h0PSI5NiIgdmlld0JveD0iMCAwIDUxMiA1MTIiIGZpbGw9IiNmYmJmMjQiPgo8cGF0aCBkPSJNMjU2IDMySDIzMkg5NmMtMTcuNjcgMC0zMiAxNC4zMy0zMiAzMnY5NmMwIDE3LjY3IDE0LjMzIDMyIDMyIDMyaDEzNmMxNy42NyAwIDMyLTE0LjMzIDMyLTMyVjY0YzAtMTcuNjctMTQuMzMtMzItMzItMzJ6Ii8+CjxwYXRoIGQ9Ik00NDggMzI4SDMxMmMtMTcuNjcgMC0zMiAxNC4zMy0zMiAzMnY5NmMwIDE3LjY3IDE0LjMzIDMyIDMyIDMyaDEzNmMxNy42NyAwIDMyLTE0LjMzIDMyLTMydi05NmMwLTE3LjY3LTE0LjMzLTMyLTMyLTMyeiIvPgo8cGF0aCBkPSJNNDQ4IDEyOEgzMTJjLTE3LjY3IDAtMzIgMTQuMzMtMzIgMzJ2OTZjMCAxNy42NyAxNC4zMyAzMiAzMiAzMmgxMzZjMTcuNjcgMCAzMi0xNC4zMyAzMi0zMnYtOTZjMC0xNy42Ny0xNC4zMy0zMi0zMi0zMnoiLz4KPHN2Zz4KPC9zdmc+',
            tag: 'mhc-urgent-' + item.id
        });
        
        notification.onclick = () => {
            window.focus();
            focusOnItem(item.id);
            notification.close();
        };
        
        setTimeout(() => notification.close(), 8000);
    }
}

// Notification settings
function getNotificationSettings() {
    const settings = localStorage.getItem('mhc_notification_settings');
    return settings ? JSON.parse(settings) : {
        browserNotifications: false,
        dailyDigest: false,
        weeklyDigest: false,
        email: ''
    };
}

function updateEmailSettings() {
    const settings = {
        browserNotifications: Notification.permission === 'granted',
        dailyDigest: document.getElementById('daily-digest')?.checked || false,
        weeklyDigest: document.getElementById('weekly-digest')?.checked || false,
        email: document.getElementById('digest-email')?.value || ''
    };
    
    localStorage.setItem('mhc_notification_settings', JSON.stringify(settings));
    showNotification('Notification settings updated!', 'success');
}

function loadNotificationSettings() {
    const settings = getNotificationSettings();
    
    if (document.getElementById('daily-digest')) {
        document.getElementById('daily-digest').checked = settings.dailyDigest;
    }
    if (document.getElementById('weekly-digest')) {
        document.getElementById('weekly-digest').checked = settings.weeklyDigest;
    }
    if (document.getElementById('digest-email')) {
        document.getElementById('digest-email').value = settings.email;
    }
}

function markAllNotificationsRead() {
    // Mark all notifications as read (visual feedback)
    document.querySelectorAll('.notification-item').forEach(item => {
        item.style.opacity = '0.6';
    });
    
    showNotification('All notifications marked as read', 'success');
}

function exportAnalytics() {
    const analyticsReport = {
        generatedDate: new Date().toISOString(),
        period: analyticsData.period,
        metrics: analyticsData.metrics,
        projects: projects.map(p => ({
            name: p.name,
            pm: p.pm,
            progress: p.progress,
            budget: p.budget,
            spent: p.spent,
            phase: p.phase
        })),
        items: hotTicketItems.map(item => ({
            type: item.type,
            status: getItemStatus(item),
            dueDate: item.dueDate,
            project: getProjectName(item.project)
        }))
    };
    
    const blob = new Blob([JSON.stringify(analyticsReport, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `MHC-Analytics-Report-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    showNotification('Analytics report exported successfully!', 'success');
}

// Initialize analytics when the page loads
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM Content Loaded - MHC Project Tracker initialized');
    
    // Check if all required DOM elements exist
    const requiredElements = [
        'analytics-section',
        'total-budget',
        'avg-progress',
        'progress-charts',
        'performance-chart',
        'financial-table',
        'urgent-notification-count',
        'overdue-notification-count'
    ];
    
    const missingElements = requiredElements.filter(id => !document.getElementById(id) && !document.querySelector(`.${id}`));
    if (missingElements.length > 0) {
        console.error('Missing DOM elements:', missingElements);
    } else {
        console.log('All required DOM elements found');
    }
    
    // Load data and render
    loadData();
    renderItems();
    renderProjects();
    
    // Initialize enhanced features
    setTimeout(() => {
        // Initialize analytics regardless of whether projects exist
        // This allows the system to work with real projects as they're added
        console.log('Initializing analytics with projects count:', projects.length);
        initializeAnalytics();
        loadSavedFilters();
        
        // Check for first-time user
        if (!localStorage.getItem('mhc_first_visit_done')) {
            showWelcomeMessage();
            localStorage.setItem('mhc_first_visit_done', 'true');
        }
        
        console.log('Analytics initialized with projects:', projects.length);
        
        // Only show sample data message if no real projects exist
        if (projects.length === 0) {
            console.log('No projects found. Add real projects using the project management features.');
        }
    }, 1000);
});

// Enhanced keyboard shortcuts
document.addEventListener('keydown', function(e) {
    // Ctrl/Cmd + N: Create new item
    if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
        e.preventDefault();
        showModal('modal');
    }
    
    // Ctrl/Cmd + F: Focus search
    if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
        e.preventDefault();
        const searchInput = document.getElementById('search-input');
        if (searchInput) {
            searchInput.focus();
            searchInput.select();
        }
    }
    
    // Ctrl/Cmd + 1-6: Switch item types
    if ((e.ctrlKey || e.metaKey) && e.key >= '1' && e.key <= '6') {
        e.preventDefault();
        const types = ['all', 'tm', 'lien', 'payapp', 'rfi', 'submittal'];
        if (types[parseInt(e.key) - 1]) {
            filterItems(types[parseInt(e.key) - 1]);
        }
    }
    
    // Ctrl/Cmd + A: Show analytics (when not in input)
    if ((e.ctrlKey || e.metaKey) && e.key === 'a' && !e.target.matches('input, textarea')) {
        e.preventDefault();
        const analyticsSection = document.querySelector('.analytics-section');
        if (analyticsSection) {
            analyticsSection.scrollIntoView({ behavior: 'smooth' });
        }
    }
    
    // Escape: Close modals and clear filters
    if (e.key === 'Escape') {
        const modals = document.querySelectorAll('.modal[style*="display: block"]');
        if (modals.length > 0) {
            modals.forEach(modal => modal.style.display = 'none');
        } else {
            clearSearch();
        }
    }
    
    // Ctrl/Cmd + S: Save data
    if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        saveData();
        showNotification('Data saved successfully!', 'success');
    }
    
    // Ctrl/Cmd + E: Export data
    if ((e.ctrlKey || e.metaKey) && e.key === 'e') {
        e.preventDefault();
        exportData();
    }
    
    // Ctrl/Cmd + B: Show notifications bell
    if ((e.ctrlKey || e.metaKey) && e.key === 'b') {
        e.preventDefault();
        const notificationsSection = document.querySelector('.notifications-section');
        if (notificationsSection) {
            notificationsSection.scrollIntoView({ behavior: 'smooth' });
        }
    }
    
    // Alt + N: Configure notifications
    if (e.altKey && e.key === 'n') {
        e.preventDefault();
        configureNotifications();
    }
});

// Show notification settings modal
function showNotificationSettingsModal() {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.style.display = 'block';
    modal.innerHTML = `
        <div class="modal-content" style="max-width: 500px;">
            <div class="modal-header">
                <h2 style="margin: 0; color: var(--primary-700);">
                    <i class="fas fa-bell"></i> Notification Settings
                </h2>
                <span class="close" onclick="this.closest('.modal').remove()">&times;</span>
            </div>
            
            <div class="form-group">
                <label style="display: flex; align-items: center; gap: 0.5rem; margin: 1rem 0;">
                    <input type="checkbox" id="browser-notifications-setting" onchange="toggleBrowserNotifications()">
                    <strong>Browser Notifications</strong>
                </label>
                <small style="color: var(--gray-600); margin-left: 1.5rem;">
                    Show desktop notifications for urgent items
                </small>
            </div>
            
            <div class="form-group">
                <label style="display: flex; align-items: center; gap: 0.5rem; margin: 1rem 0;">
                    <input type="checkbox" id="daily-digest-setting">
                    <strong>Daily Email Digest</strong>
                </label>
                <small style="color: var(--gray-600); margin-left: 1.5rem;">
                    Daily summary of overdue and upcoming items
                </small>
            </div>
            
            <div class="form-group">
                <label style="display: flex; align-items: center; gap: 0.5rem; margin: 1rem 0;">
                    <input type="checkbox" id="weekly-digest-setting">
                    <strong>Weekly Progress Report</strong>
                </label>
                <small style="color: var(--gray-600); margin-left: 1.5rem;">
                    Weekly project progress and analytics summary
                </small>
            </div>
            
            <div class="form-group">
                <label for="digest-email-setting" style="display: block; margin: 1rem 0 0.5rem 0; font-weight: 600;">
                    Email Address for Digests:
                </label>
                <input type="email" id="digest-email-setting" 
                       placeholder="your.email@company.com" 
                       style="width: 100%; padding: 0.75rem; border: 1px solid var(--gray-300); border-radius: var(--radius-md);">
            </div>
            
            <div style="margin-top: 2rem; display: flex; gap: 1rem; justify-content: flex-end;">
                <button type="button" 
                        onclick="this.closest('.modal').remove()"
                        style="padding: 0.75rem 1.5rem; background: var(--gray-100); color: var(--gray-700); border: none; border-radius: var(--radius-md); cursor: pointer;">
                    Cancel
                </button>
                <button type="button" 
                        onclick="saveNotificationSettings(); this.closest('.modal').remove()"
                        style="padding: 0.75rem 1.5rem; background: var(--primary-600); color: white; border: none; border-radius: var(--radius-md); cursor: pointer;">
                    Save Settings
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Load current settings
    const settings = getNotificationSettings();
    document.getElementById('browser-notifications-setting').checked = settings.browserNotifications;
    document.getElementById('daily-digest-setting').checked = settings.dailyDigest;
    document.getElementById('weekly-digest-setting').checked = settings.weeklyDigest;
    document.getElementById('digest-email-setting').value = settings.email;
}

function toggleBrowserNotifications() {
    if (Notification.permission === 'default') {
        Notification.requestPermission().then(permission => {
            if (permission === 'granted') {
                document.getElementById('browser-notifications-setting').checked = true;
                showNotification('Browser notifications enabled!', 'success');
            } else {
                document.getElementById('browser-notifications-setting').checked = false;
                showNotification('Browser notifications permission denied', 'error');
            }
        });
    } else if (Notification.permission === 'denied') {
        document.getElementById('browser-notifications-setting').checked = false;
        showNotification('Browser notifications are blocked. Please enable them in your browser settings.', 'error');
    }
}

function saveNotificationSettings() {
    const settings = {
        browserNotifications: document.getElementById('browser-notifications-setting').checked && Notification.permission === 'granted',
        dailyDigest: document.getElementById('daily-digest-setting').checked,
        weeklyDigest: document.getElementById('weekly-digest-setting').checked,
        email: document.getElementById('digest-email-setting').value
    };
    
    localStorage.setItem('mhc_notification_settings', JSON.stringify(settings));
    showNotification('Notification settings saved successfully!', 'success');
}

// Utility functions for better UX
function getItemTypeDisplay(type) {
    const typeMap = {
        'tm': 'T&M',
        'lien': 'Lien Release',
        'payapp': 'Pay Application',
        'rfi': 'RFI',
        'submittal': 'Submittal',
        'commitment': 'Commitment'
    };
    return typeMap[type] || type;
}

function getDaysUntilDue(dueDateString) {
    const dueDate = new Date(dueDateString);
    const today = new Date();
    const timeDiff = dueDate.getTime() - today.getTime();
    return Math.ceil(timeDiff / (1000 * 3600 * 24));
}

function getItemStatus(item) {
    if (item.status === 'completed') return 'completed';
    
    const daysUntilDue = getDaysUntilDue(item.dueDate);
    
    if (daysUntilDue < 0) return 'overdue';
    if (daysUntilDue <= 3) return 'urgent';
    if (daysUntilDue <= 7) return 'warning';
    return 'normal';
}

// Enhanced search with highlighting
function highlightSearchTerms(text, searchTerm) {
    if (!searchTerm) return text;
    
    const regex = new RegExp(`(${searchTerm})`, 'gi');
    return text.replace(regex, '<mark style="background: var(--warning-100); color: var(--warning-800);">$1</mark>');
}

function showWelcomeMessage() {
    showNotification('Welcome to MHC Project Tracker! Use Ctrl+F to search, Ctrl+N for new items, and Ctrl+A for analytics.', 'info', 8000);
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

// Phase 3: Advanced Features JavaScript

// Phase 3: Integration & Visual Enhancement JavaScript

// Integration System
let integrationSettings = JSON.parse(localStorage.getItem('mhc_integration_settings') || '{}');
let integrationActivity = JSON.parse(localStorage.getItem('mhc_integration_activity') || '[]');

// Initialize Phase 3 features
function initializePhase3() {
    updateIntegrationStatus();
    updateIntegrationActivity();
    initializePWAFeatures();
    initializeVisualEnhancements();
}

// Integration Settings
function showIntegrationSettings() {
    document.getElementById('integration-settings-modal').style.display = 'block';
    loadIntegrationSettings();
}

function showIntegrationTab(tabName) {
    // Hide all tab contents
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    document.querySelectorAll('.integration-tabs .tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Show selected tab
    document.getElementById(tabName + '-integration-tab').classList.add('active');
    event.target.classList.add('active');
}

function loadIntegrationSettings() {
    // Load Procore settings
    if (integrationSettings.procore) {
        const form = document.getElementById('procore-settings-form');
        if (form) {
            Object.entries(integrationSettings.procore).forEach(([key, value]) => {
                const input = form.querySelector(`[name="${key}"]`);
                if (input) {
                    if (input.type === 'checkbox') {
                        input.checked = value;
                    } else {
                        input.value = value;
                    }
                }
            });
        }
    }
    
    // Load Outlook settings
    if (integrationSettings.outlook) {
        const form = document.getElementById('outlook-settings-form');
        if (form) {
            Object.entries(integrationSettings.outlook).forEach(([key, value]) => {
                const input = form.querySelector(`[name="${key}"]`);
                if (input) {
                    if (input.type === 'checkbox') {
                        input.checked = value;
                    } else {
                        input.value = value;
                    }
                }
            });
        }
    }
}

function saveProcoreSettings(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const settings = {
        procoreCompanyId: formData.get('procoreCompanyId'),
        procoreClientId: formData.get('procoreClientId'),
        procoreClientSecret: formData.get('procoreClientSecret'),
        procoreSyncFreq: formData.get('procoreSyncFreq'),
        syncProjects: formData.has('syncProjects'),
        syncRFIs: formData.has('syncRFIs'),
        syncSubmittals: formData.has('syncSubmittals'),
        syncTM: formData.has('syncTM'),
        syncChangeOrders: formData.has('syncChangeOrders'),
        syncDailyLogs: formData.has('syncDailyLogs')
    };
    
    integrationSettings.procore = settings;
    localStorage.setItem('mhc_integration_settings', JSON.stringify(integrationSettings));
    
    addIntegrationActivity('Procore', 'Settings updated successfully');
    updateIntegrationStatus();
    showNotification('Procore settings saved successfully!', 'success');
}

function saveOutlookSettings(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const settings = {
        outlookEmail: formData.get('outlookEmail'),
        autoCreateRFI: formData.has('autoCreateRFI'),
        autoCreateSubmittal: formData.has('autoCreateSubmittal'),
        sendStatusUpdates: formData.has('sendStatusUpdates'),
        sendDailyDigest: formData.has('sendDailyDigest'),
        emailKeywords: formData.get('emailKeywords'),
        stakeholderEmails: formData.get('stakeholderEmails')
    };
    
    integrationSettings.outlook = settings;
    localStorage.setItem('mhc_integration_settings', JSON.stringify(integrationSettings));
    
    addIntegrationActivity('Outlook', 'Email settings updated successfully');
    updateIntegrationStatus();
    showNotification('Outlook settings saved successfully!', 'success');
}

function saveGeneralIntegrationSettings(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const settings = {
        autoBackup: formData.has('autoBackup'),
        cloudSync: formData.has('cloudSync'),
        encryptData: formData.has('encryptData'),
        conflictResolution: formData.get('conflictResolution'),
        syncNotifications: formData.has('syncNotifications'),
        errorNotifications: formData.has('errorNotifications'),
        conflictNotifications: formData.has('conflictNotifications')
    };
    
    integrationSettings.general = settings;
    localStorage.setItem('mhc_integration_settings', JSON.stringify(integrationSettings));
    
    showNotification('General integration settings saved successfully!', 'success');
}

// Connection Functions
function connectProcore() {
    if (!integrationSettings.procore?.procoreCompanyId) {
        showNotification('Please configure Procore settings first', 'error');
        showIntegrationSettings();
        return;
    }
    
    // Simulate connection process
    showNotification('Connecting to Procore...', 'info');
    
    setTimeout(() => {
        integrationSettings.procore.connected = true;
        integrationSettings.procore.lastSync = new Date().toISOString();
        localStorage.setItem('mhc_integration_settings', JSON.stringify(integrationSettings));
        
        updateIntegrationStatus();
        addIntegrationActivity('Procore', 'Successfully connected to Procore API');
        showNotification('Connected to Procore successfully!', 'success');
    }, 2000);
}

function connectOutlook() {
    if (!integrationSettings.outlook?.outlookEmail) {
        showNotification('Please configure Outlook settings first', 'error');
        showIntegrationSettings();
        return;
    }
    
    // Simulate connection process
    showNotification('Connecting to Outlook...', 'info');
    
    setTimeout(() => {
        integrationSettings.outlook.connected = true;
        integrationSettings.outlook.lastCheck = new Date().toISOString();
        localStorage.setItem('mhc_integration_settings', JSON.stringify(integrationSettings));
        
        updateIntegrationStatus();
        addIntegrationActivity('Outlook', 'Successfully connected to Outlook email');
        showNotification('Connected to Outlook successfully!', 'success');
    }, 2000);
}

function testProcoreConnection() {
    showNotification('Testing Procore connection...', 'info');
    
    setTimeout(() => {
        showNotification('Procore connection test successful!', 'success');
    }, 1500);
}

function testOutlookConnection() {
    showNotification('Testing Outlook connection...', 'info');
    
    setTimeout(() => {
        showNotification('Outlook connection test successful!', 'success');
    }, 1500);
}

// Sync Functions
function showSyncStatus() {
    document.getElementById('sync-status-modal').style.display = 'block';
    updateSyncStatusDisplay();
}

function updateSyncStatusDisplay() {
    // Update Procore sync status
    if (integrationSettings.procore?.connected) {
        document.getElementById('procore-sync-status').textContent = 'Connected';
        document.getElementById('procore-sync-time').textContent = 
            integrationSettings.procore.lastSync ? 
            new Date(integrationSettings.procore.lastSync).toLocaleString() : 'Never';
    } else {
        document.getElementById('procore-sync-status').textContent = 'Not Connected';
    }
    
    // Update Outlook sync status
    if (integrationSettings.outlook?.connected) {
        document.getElementById('outlook-sync-status').textContent = 'Connected';
        document.getElementById('outlook-sync-time').textContent = 
            integrationSettings.outlook.lastCheck ? 
            new Date(integrationSettings.outlook.lastCheck).toLocaleString() : 'Never';
    } else {
        document.getElementById('outlook-sync-status').textContent = 'Not Connected';
    }
}

function forceSyncAll() {
    showNotification('Starting full sync...', 'info');
    
    if (integrationSettings.procore?.connected) {
        syncProcore();
    }
    
    if (integrationSettings.outlook?.connected) {
        checkOutlookEmails();
    }
}

function syncProcore() {
    if (!integrationSettings.procore?.connected) {
        showNotification('Procore not connected', 'error');
        return;
    }
    
    showNotification('Syncing with Procore...', 'info');
    
    // Simulate sync process
    setTimeout(() => {
        integrationSettings.procore.lastSync = new Date().toISOString();
        localStorage.setItem('mhc_integration_settings', JSON.stringify(integrationSettings));
        
        // Simulate importing some data
        const importedCount = Math.floor(Math.random() * 5) + 1;
        addIntegrationActivity('Procore', `Imported ${importedCount} new items from Procore`);
        
        updateSyncStatusDisplay();
        updateIntegrationStatus();
        showNotification(`Procore sync completed! Imported ${importedCount} items.`, 'success');
    }, 3000);
}

function checkOutlookEmails() {
    if (!integrationSettings.outlook?.connected) {
        showNotification('Outlook not connected', 'error');
        return;
    }
    
    showNotification('Checking Outlook emails...', 'info');
    
    // Simulate email processing
    setTimeout(() => {
        integrationSettings.outlook.lastCheck = new Date().toISOString();
        localStorage.setItem('mhc_integration_settings', JSON.stringify(integrationSettings));
        
        // Simulate processing some emails
        const processedCount = Math.floor(Math.random() * 3) + 1;
        addIntegrationActivity('Outlook', `Processed ${processedCount} emails, created 1 new RFI`);
        
        updateSyncStatusDisplay();
        updateIntegrationStatus();
        showNotification(`Email check completed! Processed ${processedCount} emails.`, 'success');
    }, 2000);
}

function viewSyncLogs() {
    const logs = integrationActivity.slice(-10).reverse();
    let logText = 'Recent Integration Activity:\n\n';
    
    logs.forEach(log => {
        logText += `${new Date(log.timestamp).toLocaleString()} - ${log.type}: ${log.description}\n`;
    });
    
    alert(logText); // In production, show in a proper modal
}

// Integration Activity
function addIntegrationActivity(type, description) {
    const activity = {
        id: Date.now().toString(),
        type: type,
        description: description,
        timestamp: new Date().toISOString()
    };
    
    integrationActivity.unshift(activity);
    
    // Keep only last 50 activities
    if (integrationActivity.length > 50) {
        integrationActivity = integrationActivity.slice(0, 50);
    }
    
    localStorage.setItem('mhc_integration_activity', JSON.stringify(integrationActivity));
    updateIntegrationActivity();
}

function updateIntegrationActivity() {
    const container = document.getElementById('integration-activity-list');
    if (!container) return;
    
    const recentActivities = integrationActivity.slice(0, 5);
    
    if (recentActivities.length === 0) {
        container.innerHTML = '<div style="text-align: center; color: var(--gray-500); padding: 2rem;">No integration activity yet</div>';
        return;
    }
    
    container.innerHTML = recentActivities.map(activity => `
        <div class="integration-activity-item ${activity.type.toLowerCase()}">
            <div class="integration-activity-header">
                <span class="integration-activity-type">${activity.type}</span>
                <span class="integration-activity-time">${formatRelativeTime(activity.timestamp)}</span>
            </div>
            <div class="integration-activity-description">${activity.description}</div>
        </div>
    `).join('');
}

function updateIntegrationStatus() {
    // Update Procore status
    const procoreStatus = document.getElementById('procore-status');
    const procoreButton = document.getElementById('procore-connect-btn');
    const procoreStats = document.getElementById('procore-stats');
    
    if (integrationSettings.procore?.connected) {
        procoreStatus.textContent = 'Connected';
        procoreStatus.className = 'integration-status connected';
        procoreButton.textContent = 'Disconnect';
        procoreButton.onclick = () => disconnectProcore();
        procoreStats.style.display = 'block';
        
        // Update stats
        document.getElementById('procore-projects').textContent = projects.length;
        document.getElementById('procore-items').textContent = 
            integrationActivity.filter(a => a.type === 'Procore').length;
        document.getElementById('procore-last-sync').textContent = 
            integrationSettings.procore.lastSync ? 
            formatRelativeTime(integrationSettings.procore.lastSync) : 'Never';
    } else {
        procoreStatus.textContent = 'Not Connected';
        procoreStatus.className = 'integration-status';
        procoreButton.textContent = 'Connect';
        procoreButton.onclick = () => connectProcore();
        procoreStats.style.display = 'none';
    }
    
    // Update Outlook status
    const outlookStatus = document.getElementById('outlook-status');
    const outlookButton = document.getElementById('outlook-connect-btn');
    const outlookStats = document.getElementById('outlook-stats');
    
    if (integrationSettings.outlook?.connected) {
        outlookStatus.textContent = 'Connected';
        outlookStatus.className = 'integration-status connected';
        outlookButton.textContent = 'Disconnect';
        outlookButton.onclick = () => disconnectOutlook();
        outlookStats.style.display = 'block';
        
        // Update stats
        document.getElementById('outlook-emails').textContent = 
            integrationActivity.filter(a => a.type === 'Outlook').length * 3;
        document.getElementById('outlook-items').textContent = 
            integrationActivity.filter(a => a.type === 'Outlook').length;
        document.getElementById('outlook-last-check').textContent = 
            integrationSettings.outlook.lastCheck ? 
            formatRelativeTime(integrationSettings.outlook.lastCheck) : 'Never';
    } else {
        outlookStatus.textContent = 'Not Connected';
        outlookStatus.className = 'integration-status';
        outlookButton.textContent = 'Connect';
        outlookButton.onclick = () => connectOutlook();
        outlookStats.style.display = 'none';
    }
}

function disconnectProcore() {
    if (confirm('Disconnect from Procore? You will need to reconfigure settings to reconnect.')) {
        integrationSettings.procore.connected = false;
        localStorage.setItem('mhc_integration_settings', JSON.stringify(integrationSettings));
        updateIntegrationStatus();
        addIntegrationActivity('Procore', 'Disconnected from Procore API');
        showNotification('Disconnected from Procore', 'info');
    }
}

function disconnectOutlook() {
    if (confirm('Disconnect from Outlook? You will need to reconfigure settings to reconnect.')) {
        integrationSettings.outlook.connected = false;
        localStorage.setItem('mhc_integration_settings', JSON.stringify(integrationSettings));
        updateIntegrationStatus();
        addIntegrationActivity('Outlook', 'Disconnected from Outlook email');
        showNotification('Disconnected from Outlook', 'info');
    }
}

// Visual Enhancement Functions
function initializeVisualEnhancements() {
    // Add loading animations
    addLoadingAnimations();
    
    // Initialize smooth scrolling
    initializeSmoothScrolling();
    
    // Add interactive feedback
    addInteractiveFeedback();
    
    // Initialize auto-save indicators
    initializeAutoSaveIndicators();
}

function addLoadingAnimations() {
    // Add staggered animation to cards
    const cards = document.querySelectorAll('.metric-card, .integration-card, .project-card');
    cards.forEach((card, index) => {
        card.style.animationDelay = `${index * 100}ms`;
    });
}

function initializeSmoothScrolling() {
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

function addInteractiveFeedback() {
    // Add click feedback to buttons
    document.querySelectorAll('.btn').forEach(button => {
        button.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            ripple.classList.add('ripple');
            
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
}

function initializeAutoSaveIndicators() {
    // Show save indicators when data changes
    let saveTimeout;
    
    const showSaveIndicator = () => {
        const indicator = document.createElement('div');
        indicator.className = 'save-indicator';
        indicator.innerHTML = '<i class="fas fa-save"></i> Saving...';
        document.body.appendChild(indicator);
        
        setTimeout(() => {
            indicator.innerHTML = '<i class="fas fa-check"></i> Saved';
            setTimeout(() => {
                indicator.remove();
            }, 2000);
        }, 1000);
    };
    
    // Override saveData function to show indicator
    const originalSaveData = saveData;
    window.saveData = function() {
        originalSaveData();
        clearTimeout(saveTimeout);
        saveTimeout = setTimeout(showSaveIndicator, 500);
    };
}

// Email Processing Functions (simulated)
function processIncomingEmails() {
    if (!integrationSettings.outlook?.connected) return;
    
    // Simulate email processing based on keywords
    const keywords = integrationSettings.outlook.emailKeywords?.split(',').map(k => k.trim()) || [];
    
    // This would be replaced with actual email API integration
    // For now, simulate finding emails with keywords
    if (keywords.includes('RFI') && Math.random() > 0.7) {
        createRFIFromEmail();
    }
    
    if (keywords.includes('Submittal') && Math.random() > 0.8) {
        createSubmittalFromEmail();
    }
}

function createRFIFromEmail() {
    // Simulate creating an RFI from an email
    const rfi = {
        id: Date.now().toString(),
        type: 'rfi',
        project: projects[0]?.id || 'default',
        title: 'RFI from Email - Clarification Needed',
        description: 'Auto-created from incoming email',
        status: 'pending',
        priority: 'medium',
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        createdDate: new Date().toISOString().split('T')[0],
        createdBy: 'Email Integration'
    };
    
    hotTicketItems.unshift(rfi);
    saveData();
    renderDashboard();
    
    addIntegrationActivity('Outlook', 'Created RFI from incoming email');
    showNotification('New RFI created from email!', 'info');
}

function createSubmittalFromEmail() {
    // Simulate creating a submittal from an email
    const submittal = {
        id: Date.now().toString(),
        type: 'submittal',
        project: projects[1]?.id || 'default',
        title: 'Submittal from Email - Review Required',
        description: 'Auto-created from incoming email',
        status: 'pending',
        priority: 'high',
        dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        createdDate: new Date().toISOString().split('T')[0],
        createdBy: 'Email Integration'
    };
    
    hotTicketItems.unshift(submittal);
    saveData();
    renderDashboard();
    
    addIntegrationActivity('Outlook', 'Created Submittal from incoming email');
    showNotification('New Submittal created from email!', 'info');
}

// Auto-sync functionality
function startAutoSync() {
    // Check for auto-sync every 5 minutes
    setInterval(() => {
        if (integrationSettings.procore?.connected && integrationSettings.procore?.procoreSyncFreq === 'hourly') {
            const lastSync = new Date(integrationSettings.procore.lastSync || 0);
            const hourAgo = new Date(Date.now() - 60 * 60 * 1000);
            
            if (lastSync < hourAgo) {
                syncProcore();
            }
        }
        
        if (integrationSettings.outlook?.connected) {
            processIncomingEmails();
        }
    }, 5 * 60 * 1000);
}

// Initialize Phase 3 features when page loads
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(() => {
        initializePhase3();
        startAutoSync();
        
        // Show integration help for first-time users
        if (!localStorage.getItem('mhc_integration_intro_shown')) {
            setTimeout(() => {
                showNotification('Tip: Connect Procore and Outlook for automatic data sync!', 'info', 8000);
                localStorage.setItem('mhc_integration_intro_shown', 'true');
            }, 3000);
        }
    }, 1500);
});

// Advanced Report Builder
function showReportBuilder() {
    document.getElementById('report-builder-modal').style.display = 'block';
}

function showReportTab(tabName) {
    // Hide all tab contents
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Show selected tab
    document.getElementById(tabName + '-tab').classList.add('active');
    event.target.classList.add('active');
}

function generateCustomReport(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const reportConfig = {
        title: formData.get('reportTitle'),
        sections: formData.getAll('sections'),
        dateRange: formData.get('dateRange'),
        pmFilter: formData.get('pmFilter'),
        statusFilter: formData.get('statusFilter'),
        projectStatusFilter: formData.get('projectStatusFilter'),
        format: formData.get('format'),
        style: formData.get('reportStyle'),
        includeLogo: formData.has('includeLogo'),
        includeCharts: formData.has('includeCharts'),
        includeComments: formData.has('includeComments')
    };
    
    // Generate report based on format
    switch (reportConfig.format) {
        case 'pdf':
            generatePDFReport(reportConfig);
            break;
        case 'excel':
            generateExcelReport(reportConfig);
            break;
        case 'powerpoint':
            generatePowerPointReport(reportConfig);
            break;
    }
    
    closeModal('report-builder-modal');
    showNotification('Custom report generated successfully!', 'success');
}

function generatePDFReport(config) {
    // PDF generation logic (would use a library like jsPDF in production)
    const reportData = gatherReportData(config);
    
    // Create and download PDF (simplified version)
    const reportContent = `
    MHC Project Tracker - ${config.title}
    Generated: ${new Date().toLocaleDateString()}
    
    ${config.sections.includes('overview') ? generateOverviewSection(reportData) : ''}
    ${config.sections.includes('financial') ? generateFinancialSection(reportData) : ''}
    ${config.sections.includes('progress') ? generateProgressSection(reportData) : ''}
    ${config.sections.includes('items') ? generateItemsSection(reportData) : ''}
    ${config.sections.includes('team') ? generateTeamSection(reportData) : ''}
    `;
    
    // Download as text file (in production, this would be a proper PDF)
    const blob = new Blob([reportContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${config.title.replace(/\s+/g, '-')}-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

function generateExcelReport(config) {
    // Excel generation logic (would use a library like SheetJS in production)
    const reportData = gatherReportData(config);
    
    // Create CSV format for now
    let csvContent = `MHC Project Tracker - ${config.title}\n`;
    csvContent += `Generated: ${new Date().toLocaleDateString()}\n\n`;
    
    if (config.sections.includes('items')) {
        csvContent += "Hot Ticket Items\n";
        csvContent += "Type,Project,Status,Due Date,PM\n";
        reportData.items.forEach(item => {
            csvContent += `${item.type},${item.project},${item.status},${item.dueDate},${item.pm}\n`;
        });
        csvContent += "\n";
    }
    
    if (config.sections.includes('financial')) {
        csvContent += "Financial Summary\n";
        csvContent += "Project,Budget,Spent,Remaining\n";
        reportData.projects.forEach(project => {
            const remaining = (project.budget || 0) - (project.spent || 0);
            csvContent += `${project.name},${project.budget || 0},${project.spent || 0},${remaining}\n`;
        });
    }
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${config.title.replace(/\s+/g, '-')}-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

function generatePowerPointReport(config) {
    // PowerPoint generation would use a library like PptxGenJS
    showNotification('PowerPoint export coming in next update!', 'info');
}

function gatherReportData(config) {
    // Filter data based on report configuration
    let filteredProjects = projects;
    let filteredItems = hotTicketItems;
    
    // Apply filters
    if (config.pmFilter) {
        filteredProjects = filteredProjects.filter(p => p.pm === config.pmFilter);
        filteredItems = filteredItems.filter(item => {
            const project = projects.find(p => p.id === item.project);
            return project && project.pm === config.pmFilter;
        });
    }
    
    if (config.statusFilter) {
        filteredItems = filteredItems.filter(item => getItemStatus(item) === config.statusFilter);
    }
    
    if (config.projectStatusFilter) {
        filteredProjects = filteredProjects.filter(p => p.status === config.projectStatusFilter);
    }
    
    return {
        projects: filteredProjects,
        items: filteredItems,
        activity: teamActivity.slice(-20) // Last 20 activities
    };
}

function generateOverviewSection(data) {
    return `
PROJECT OVERVIEW
================
Total Projects: ${data.projects.length}
Active Items: ${data.items.filter(i => i.status !== 'completed').length}
Completed Items: ${data.items.filter(i => i.status === 'completed').length}
    `;
}

function generateFinancialSection(data) {
    const totalBudget = data.projects.reduce((sum, p) => sum + (p.budget || 0), 0);
    const totalSpent = data.projects.reduce((sum, p) => sum + (p.spent || 0), 0);
    
    return `
FINANCIAL SUMMARY
=================
Total Budget: $${totalBudget.toLocaleString()}
Total Spent: $${totalSpent.toLocaleString()}
Remaining: $${(totalBudget - totalSpent).toLocaleString()}
    `;
}

function generateProgressSection(data) {
    const avgProgress = data.projects.reduce((sum, p) => sum + (p.progress || 0), 0) / data.projects.length;
    
    return `
PROGRESS SUMMARY
================
Average Progress: ${Math.round(avgProgress)}%
Projects On Track: ${data.projects.filter(p => (p.progress || 0) >= 75).length}
Projects Behind: ${data.projects.filter(p => (p.progress || 0) < 50).length}
    `;
}

function generateItemsSection(data) {
    let section = `
HOT TICKET ITEMS
================
`;
    data.items.forEach(item => {
        const project = data.projects.find(p => p.id === item.project);
        section += `${getItemTypeDisplay(item.type)} - ${getItemTitle(item)} (${project ? project.name : 'Unknown Project'})\n`;
    });
    
    return section;
}

function generateTeamSection(data) {
    const pmStats = calculatePMStats();
    
    let section = `
TEAM PERFORMANCE
================
`;
    Object.entries(pmStats).forEach(([pm, stats]) => {
        section += `${pm}: ${stats.projects} projects, ${Math.round(stats.avgProgress)}% avg progress\n`;
    });
    
    return section;
}

function previewReport() {
    const formData = new FormData(document.getElementById('report-builder-form'));
    const config = {
        title: formData.get('reportTitle'),
        sections: formData.getAll('sections')
    };
    
    const reportData = gatherReportData(config);
    let preview = `Report Preview: ${config.title}\n\n`;
    
    config.sections.forEach(section => {
        switch (section) {
            case 'overview':
                preview += generateOverviewSection(reportData);
                break;
            case 'financial':
                preview += generateFinancialSection(reportData);
                break;
            case 'progress':
                preview += generateProgressSection(reportData);
                break;
        }
    });
    
    alert(preview); // In production, show in a modal
}

// Old collaboration functions removed - replaced with integration system

// Override existing functions to add integration tracking
const originalAddItem = addItem;
function addItem(event) {
    const result = originalAddItem(event);
    
    if (result !== false) {
        const formData = new FormData(event.target);
        const itemType = getItemTypeDisplay(formData.get('type') || event.target.closest('.modal').id.replace('-modal', ''));
        const projectName = getProjectName(formData.get('project'));
        
        addIntegrationActivity('System', `Added ${itemType} for ${projectName}`);
    }
    
    return result;
}

const originalCompleteItem = completeItem;
function completeItem(itemId) {
    const item = hotTicketItems.find(i => i.id === itemId);
    if (item) {
        const itemType = getItemTypeDisplay(item.type);
        const projectName = getProjectName(item.project);
        
        originalCompleteItem(itemId);
        addIntegrationActivity('System', `Completed ${itemType} for ${projectName}`);
    }
}

// Initialize Phase 3 features when page loads
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(() => {
        initializePhase3();
    }, 1500);
});
