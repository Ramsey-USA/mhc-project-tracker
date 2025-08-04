// Utility for selecting elements
export function selectElement(selector) {
    const element = document.querySelector(selector);
    if (!element) {
        console.warn(`Element not found: ${selector}`);
        return null;
    }
    return element;
}

// Utility for creating elements
export function createElement(tag, attributes = {}, textContent = '') {
    const element = document.createElement(tag);
    Object.keys(attributes).forEach(attr => {
        element.setAttribute(attr, attributes[attr]);
    });
    if (textContent) {
        element.textContent = textContent;
    }
    return element;
}

// Utility for appending children to a parent element
export function appendChildren(parent, children) {
    children.forEach(child => parent.appendChild(child));
}

// Utility for fetching data
export async function fetchData(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    }
}

// Utility for rendering a table
export function renderTable(container, headers, data) {
    const table = createElement('table', { class: 'dashboard-table' });

    // Create table header
    const thead = createElement('thead');
    const headerRow = createElement('tr');
    headers.forEach(header => {
        const th = createElement('th', {}, header);
        headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);
    table.appendChild(thead);

    // Create table body
    const tbody = createElement('tbody');
    data.forEach(rowData => {
        const row = createElement('tr');
        rowData.forEach(cellData => {
            const td = createElement('td', {}, cellData);
            row.appendChild(td);
        });
        tbody.appendChild(row);
    });
    table.appendChild(tbody);

    // Append table to container
    container.innerHTML = ''; // Clear existing content
    container.appendChild(table);
}

// Utility for adding event listeners
export function addEventListener(element, event, callback) {
    element.addEventListener(event, callback);
}