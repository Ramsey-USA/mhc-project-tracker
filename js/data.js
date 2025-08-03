// Mock data for the dashboard
const mockData = {
    financial: {
        totalBudget: 1000000,
        spent: 450000,
    },
    progress: {
        totalTasks: 100,
        completedTasks: 75,
    },
    performance: {
        issuesResolved: 50,
        totalIssues: 60,
    },
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