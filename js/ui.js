import { selectElement, createElement, appendChildren } from './utils.js';
import { getFinancialData, getProgressData, getPerformanceData } from './data.js';

// Function to update financial metrics
export function updateFinancialMetrics() {
    const data = getFinancialData();
    selectElement('#financial-value').textContent = `$${data.spent}`;
    selectElement('#financial-progress').style.width = `${data.progress}%`;
    selectElement('#total-budget').textContent = `$${data.totalBudget}`;
    selectElement('#budget-spent').textContent = `$${data.spent} spent`;
}

// Function to update progress metrics
export function updateProgressMetrics() {
    const data = getProgressData();
    selectElement('#progress-value').textContent = `${data.progress.toFixed(1)}%`;
    selectElement('#progress-bar').style.width = `${data.progress}%`;
    selectElement('#avg-progress').textContent = `${data.progress.toFixed(1)}%`;
    selectElement('#progress-trend').textContent = `+${data.progress.toFixed(1)}% this month`;
}

// Function to update performance metrics
export function updatePerformanceMetrics() {
    const data = getPerformanceData();
    selectElement('#performance-value').textContent = `${data.issuesResolved}`;
    selectElement('#performance-efficiency').textContent = `${data.efficiency.toFixed(1)}% efficiency`;
}

// Function to initialize carousel navigation
export function initializeCarousel() {
    let currentIndex = 0;
    const carousel = selectElement('#quick-add-carousel');
    const items = carousel.children;
    const totalItems = items.length;

    function updateCarousel() {
        Array.from(items).forEach((item, index) => {
            item.style.display = index === currentIndex ? 'block' : 'none';
        });
    }

    selectElement('#carousel-prev').addEventListener('click', () => {
        currentIndex = (currentIndex - 1 + totalItems) % totalItems;
        updateCarousel();
    });

    selectElement('#carousel-next').addEventListener('click', () => {
        currentIndex = (currentIndex + 1) % totalItems;
        updateCarousel();
    });

    updateCarousel();
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
    initializeCarousel();

    console.log('Dashboard initialized');
}