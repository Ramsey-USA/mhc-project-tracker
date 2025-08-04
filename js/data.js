// Mock data for the dashboard
const mockData = {
    financial: {
        totalBudget: 2750000,
        spent: 1125000,
    },
    progress: {
        totalTasks: 156,
        completedTasks: 98,
    },
    performance: {
        issuesResolved: 67,
        totalIssues: 78,
    },
    projects: [
        {
            id: 'makayla-job1',
            name: 'Downtown Office Complex',
            pm: 'Makayla',
            status: 'active',
            progress: 75,
            budget: 850000,
            spent: 425000,
            startDate: '2024-03-15',
            endDate: '2025-09-30',
            phase: 'Construction',
            description: 'Modern 12-story office building with retail space on ground floor',
            notes: 'Weather delays pushed timeline back 2 weeks',
            hotTickets: 23,
            overdueItems: 3
        },
        {
            id: 'makayla-job2',
            name: 'Westside Retail Center',
            pm: 'Makayla',
            status: 'active',
            progress: 45,
            budget: 650000,
            spent: 195000,
            startDate: '2024-07-01',
            endDate: '2025-12-15',
            phase: 'Design Development',
            description: '45,000 sq ft shopping center with anchor tenant',
            notes: 'Waiting on final tenant approvals',
            hotTickets: 18,
            overdueItems: 1
        },
        {
            id: 'ben-job1',
            name: 'Industrial Warehouse Expansion',
            pm: 'Ben',
            status: 'active',
            progress: 92,
            budget: 425000,
            spent: 380000,
            startDate: '2024-01-10',
            endDate: '2025-08-30',
            phase: 'Final Inspections',
            description: 'Adding 25,000 sq ft to existing warehouse facility',
            notes: 'Ahead of schedule, preparing for final walkthrough',
            hotTickets: 8,
            overdueItems: 0
        },
        {
            id: 'ben-job2',
            name: 'Manufacturing Plant Upgrade',
            pm: 'Ben',
            status: 'active',
            progress: 68,
            budget: 1200000,
            spent: 720000,
            startDate: '2024-05-20',
            endDate: '2026-01-15',
            phase: 'MEP Installation',
            description: 'Complete electrical and HVAC system overhaul',
            notes: 'Equipment delivery delayed, adjusting schedule',
            hotTickets: 31,
            overdueItems: 5
        },
        {
            id: 'ben-job3',
            name: 'Distribution Center',
            pm: 'Ben',
            status: 'on-hold',
            progress: 15,
            budget: 2100000,
            spent: 315000,
            startDate: '2024-09-01',
            endDate: '2026-08-30',
            phase: 'Permitting',
            description: 'New 150,000 sq ft automated distribution facility',
            notes: 'On hold pending environmental review',
            hotTickets: 12,
            overdueItems: 2
        },
        {
            id: 'jeremy-darigold',
            name: 'Darigold Processing Plant',
            pm: 'Jeremy',
            status: 'active',
            progress: 33,
            budget: 3200000,
            spent: 960000,
            startDate: '2024-04-01',
            endDate: '2026-12-31',
            phase: 'Foundation & Structural',
            description: 'New dairy processing facility with cold storage',
            notes: 'Major project with multiple phases and strict food safety requirements',
            hotTickets: 42,
            overdueItems: 7
        }
    ],
    hotTicketItems: [
        {
            id: 'ht001',
            type: 'tm',
            project: 'makayla-job1',
            employee: 'Mike Johnson',
            hours: 8.5,
            date: '2025-08-01',
            description: 'Emergency HVAC repair on 8th floor - system failure',
            dueDate: '2025-08-05',
            priority: 'critical',
            ballInCourt: 'mhc',
            status: 'urgent',
            paidStatus: 'pending'
        },
        {
            id: 'ht002',
            type: 'rfi',
            project: 'ben-job2',
            rfiNumber: 'RFI-2025-045',
            subject: 'Electrical panel specifications clarification',
            description: 'Need confirmation on upgraded panel requirements for production line 3',
            dueDate: '2025-08-06',
            priority: 'high',
            ballInCourt: 'architect',
            status: 'pending',
            rfiStatus: 'submitted'
        },
        {
            id: 'ht003',
            type: 'submittal',
            project: 'jeremy-darigold',
            submittalType: 'shop-drawings',
            vendor: 'SteelCorp Industries',
            description: 'Structural steel shop drawings for main processing hall',
            dueDate: '2025-08-04',
            priority: 'high',
            ballInCourt: 'architect',
            status: 'overdue',
            reviewStatus: 'pending'
        },
        {
            id: 'ht004',
            type: 'lien',
            project: 'makayla-job1',
            vendor: 'ABC Concrete Co',
            releaseType: 'conditional',
            amount: 45000,
            dueDate: '2025-08-03',
            priority: 'critical',
            ballInCourt: 'vendor',
            status: 'overdue'
        },
        {
            id: 'ht005',
            type: 'payapp',
            project: 'ben-job1',
            payAppNumber: 'PA-2025-07',
            amount: 85000,
            periodEnding: '2025-07-31',
            dueDate: '2025-08-07',
            priority: 'normal',
            ballInCourt: 'client',
            status: 'pending',
            approvalStatus: 'approved'
        }
    ],
    notifications: {
        urgent: [
            {
                id: 'n001',
                title: 'HVAC Emergency Repair',
                message: 'Critical system failure on Downtown Office Complex - 8th floor',
                project: 'makayla-job1',
                dueDate: '2025-08-05',
                type: 'urgent'
            },
            {
                id: 'n002',
                title: 'Lien Release Overdue',
                message: 'ABC Concrete Co lien release was due yesterday',
                project: 'makayla-job1',
                dueDate: '2025-08-03',
                type: 'urgent'
            }
        ],
        overdue: [
            {
                id: 'n003',
                title: 'Steel Shop Drawings',
                message: 'SteelCorp submittal review is 1 day overdue',
                project: 'jeremy-darigold',
                dueDate: '2025-08-04',
                type: 'overdue'
            }
        ],
        milestones: [
            {
                id: 'n004',
                title: 'Warehouse Nearing Completion',
                message: 'Industrial Warehouse Expansion is 92% complete',
                project: 'ben-job1',
                type: 'milestone'
            }
        ]
    },
    integrationStatus: {
        procore: {
            connected: false,
            lastSync: null,
            projectsCount: 0,
            itemsCount: 0
        },
        outlook: {
            connected: false,
            lastCheck: null,
            emailsProcessed: 0,
            itemsCreated: 0
        }
    },
    recentActivity: [
        {
            id: 'ra001',
            type: 'item_added',
            description: 'New T&M ticket added for HVAC emergency repair',
            timestamp: '2025-08-04T09:15:00Z',
            user: 'Makayla',
            project: 'makayla-job1'
        },
        {
            id: 'ra002',
            type: 'rfi_submitted',
            description: 'RFI-2025-045 submitted for electrical panel specs',
            timestamp: '2025-08-04T08:30:00Z',
            user: 'Ben',
            project: 'ben-job2'
        },
        {
            id: 'ra003',
            type: 'submittal_overdue',
            description: 'Steel shop drawings submittal is now overdue',
            timestamp: '2025-08-04T07:00:00Z',
            user: 'System',
            project: 'jeremy-darigold'
        }
    ]
};

// Function to get financial data
export function getFinancialData() {
    const { totalBudget, spent } = mockData.financial;
    return {
        totalBudget,
        spent,
        remaining: totalBudget - spent,
        progress: (spent / totalBudget) * 100,
    };
}

// Function to get progress data
export function getProgressData() {
    const { totalTasks, completedTasks } = mockData.progress;
    return {
        totalTasks,
        completedTasks,
        progress: (completedTasks / totalTasks) * 100,
    };
}

// Function to get performance data
export function getPerformanceData() {
    const { issuesResolved, totalIssues } = mockData.performance;
    return {
        issuesResolved,
        totalIssues,
        efficiency: (issuesResolved / totalIssues) * 100,
    };
}

// Function to update mock data (for testing purposes)
export function updateMockData(section, newData) {
    if (mockData[section]) {
        mockData[section] = { ...mockData[section], ...newData };
    }
}

// Function to get projects data
export function getProjectsData() {
    return mockData.projects;
}

// Function to get hot ticket items
export function getHotTicketItems() {
    return mockData.hotTicketItems;
}

// Function to get notifications data
export function getNotificationsData() {
    return mockData.notifications;
}

// Function to get integration status
export function getIntegrationStatus() {
    return mockData.integrationStatus;
}

// Function to get recent activity
export function getRecentActivity() {
    return mockData.recentActivity;
}

// Function to get project by ID
export function getProjectById(id) {
    return mockData.projects.find(project => project.id === id);
}

// Function to get items by project
export function getItemsByProject(projectId) {
    return mockData.hotTicketItems.filter(item => item.project === projectId);
}

// Function to get items by PM
export function getItemsByPM(pm) {
    const pmProjects = mockData.projects.filter(project => project.pm === pm).map(p => p.id);
    return mockData.hotTicketItems.filter(item => pmProjects.includes(item.project));
}

// Function to get dashboard summary stats
export function getDashboardStats() {
    const projects = mockData.projects;
    const items = mockData.hotTicketItems;
    
    return {
        totalProjects: projects.length,
        activeProjects: projects.filter(p => p.status === 'active').length,
        totalItems: items.length,
        urgentItems: items.filter(i => i.status === 'urgent').length,
        overdueItems: items.filter(i => i.status === 'overdue').length,
        completedItems: items.filter(i => i.status === 'completed').length,
        totalBudget: projects.reduce((sum, p) => sum + p.budget, 0),
        totalSpent: projects.reduce((sum, p) => sum + p.spent, 0),
        avgProgress: projects.reduce((sum, p) => sum + p.progress, 0) / projects.length
    };
}