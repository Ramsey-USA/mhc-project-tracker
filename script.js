// MHC Project Tracker - JavaScript Functionality

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
            endDate: '2024-08-30'
        },
        {
            id: 'makayla-job2',
            name: 'Makayla - Retail Center',
            pm: 'Makayla',
            status: 'active',
            startDate: '2024-03-01',
            endDate: '2024-10-15'
        },
        {
            id: 'ben-job1',
            name: 'Ben - Warehouse Expansion',
            pm: 'Ben',
            status: 'active',
            startDate: '2024-02-01',
            endDate: '2024-09-30'
        },
        {
            id: 'ben-job2',
            name: 'Ben - Manufacturing Plant',
            pm: 'Ben',
            status: 'active',
            startDate: '2024-04-01',
            endDate: '2024-12-15'
        },
        {
            id: 'ben-job3',
            name: 'Ben - Distribution Center',
            pm: 'Ben',
            status: 'active',
            startDate: '2024-05-15',
            endDate: '2025-01-30'
        },
        {
            id: 'jeremy-darigold',
            name: 'Jeremy - Darigold Plant',
            pm: 'Jeremy',
            status: 'active',
            startDate: '2024-01-01',
            endDate: '2024-11-30'
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
        projectCard.innerHTML = `
            <div class="project-header">
                <div>
                    <div class="project-title">${project.name}</div>
                    <div class="project-pm">PM: ${project.pm}</div>
                </div>
                <div class="project-status status-${statusClass}">${statusText}</div>
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
    const itemsContainer = document.getElementById('items-container');
    if (!itemsContainer) return;
    
    const filteredItems = filterItems();
    itemsContainer.innerHTML = '';
    
    if (filteredItems.length === 0) {
        itemsContainer.innerHTML = `
            <div style="text-align: center; padding: 2rem; color: #6b7280;">
                <i class="fas fa-inbox" style="font-size: 3rem; margin-bottom: 1rem; opacity: 0.5;"></i>
                <p>No items found matching current filters.</p>
            </div>
        `;
        return;
    }
    
    filteredItems.forEach(item => {
        const project = projects.find(p => p.id === item.project);
        const status = getItemStatus(item);
        const daysUntil = getDaysUntilDue(item.dueDate);
        
        let daysText = '';
        if (daysUntil < 0) {
            daysText = `${Math.abs(daysUntil)} days overdue`;
        } else if (daysUntil === 0) {
            daysText = 'Due today';
        } else if (daysUntil === 1) {
            daysText = 'Due tomorrow';
        } else {
            daysText = `Due in ${daysUntil} days`;
        }
        
        let primaryText = '';
        let secondaryText = '';
        
        switch (item.type) {
            case 'tm':
                primaryText = `${item.employee} - ${item.hours} hours`;
                secondaryText = item.description;
                break;
            case 'lien':
                primaryText = item.vendor;
                secondaryText = `${item.releaseType} release - $${item.amount?.toLocaleString() || 'N/A'}`;
                break;
            case 'payapp':
                primaryText = `Pay App #${item.payAppNumber}`;
                secondaryText = `$${item.amount?.toLocaleString() || 'N/A'}`;
                break;
            case 'rfi':
                primaryText = `RFI #${item.rfiNumber || 'N/A'}`;
                secondaryText = item.subject;
                break;
            case 'submittal':
                primaryText = `Submittal: ${item.submittalType}`;
                secondaryText = item.description;
                break;
            case 'commitment':
                primaryText = `${item.subcontractor} - ${item.trade}`;
                secondaryText = `$${item.contractAmount?.toLocaleString() || 'N/A'} - ${item.agreementStatus || 'pending'}`;
                break;
        }
        
        const itemCard = document.createElement('div');
        itemCard.className = `item-card ${item.type} ${status}`;
        itemCard.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1rem;">
                <div>
                    <div style="font-weight: 700; color: #1f2937; margin-bottom: 0.25rem;">
                        ${primaryText}
                    </div>
                    <div style="color: #6b7280; font-size: 0.9rem; margin-bottom: 0.5rem;">
                        ${secondaryText || ''}
                    </div>
                    <div style="color: #374151; font-size: 0.85rem;">
                        <i class="fas fa-building"></i> ${project?.name || 'Unknown Project'}
                    </div>
                </div>
                <div style="text-align: right;">
                    <div style="font-size: 0.8rem; font-weight: 600; margin-bottom: 0.25rem; 
                        color: ${status === 'overdue' ? '#dc2626' : status === 'urgent' ? '#f59e0b' : '#6b7280'};">
                        ${daysText}
                    </div>
                    <div style="font-size: 0.75rem; color: #6b7280;">
                        Priority: ${item.priority || 'normal'}
                    </div>
                </div>
            </div>
            <div style="display: flex; justify-content: space-between; align-items: center; 
                        padding-top: 1rem; border-top: 1px solid #e5e7eb;">
                <div style="font-size: 0.8rem; color: #6b7280;">
                    <i class="fas fa-user"></i> Ball in court: ${item.ballInCourt || 'N/A'}
                </div>
                <div style="display: flex; gap: 0.5rem;">
                    <button onclick="editItem('${item.id}')" class="btn" style="padding: 0.25rem 0.75rem; font-size: 0.8rem;">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                    <button onclick="markComplete('${item.id}')" class="btn btn-primary" style="padding: 0.25rem 0.75rem; font-size: 0.8rem;">
                        <i class="fas fa-check"></i> Complete
                    </button>
                </div>
            </div>
            ${item.notes ? `<div style="margin-top: 0.5rem; padding: 0.75rem; background: #f9fafb; border-radius: 6px; font-size: 0.85rem; color: #374151;"><strong>Notes:</strong> ${item.notes}</div>` : ''}
        `;
        
        itemsContainer.appendChild(itemCard);
    });
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

// Filter items
function filterItems() {
    const searchTerm = document.getElementById('search-input').value.toLowerCase();
    const pmFilter = document.getElementById('pm-filter').value;
    const typeFilter = document.getElementById('type-filter').value;
    const statusFilter = document.getElementById('status-filter').value;
    
    return hotTicketItems.filter(item => {
        const project = projects.find(p => p.id === item.project);
        const matchesSearch = !searchTerm || 
            item.description?.toLowerCase().includes(searchTerm) ||
            item.employee?.toLowerCase().includes(searchTerm) ||
            item.vendor?.toLowerCase().includes(searchTerm) ||
            project?.name.toLowerCase().includes(searchTerm);
        
        const matchesPM = !pmFilter || project?.pm === pmFilter;
        const matchesType = !typeFilter || item.type === typeFilter;
        const matchesStatus = !statusFilter || getItemStatus(item) === statusFilter;
        
        return matchesSearch && matchesPM && matchesType && matchesStatus;
    });
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
