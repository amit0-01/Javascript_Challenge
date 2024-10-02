let selectedRow = null; 

let chemicalData = [];  
let currentSortColumn = '';  
let currentSortDirection = 'asc';  

async function fetchChemicalData() {
    try {
        const response = await fetch('chemicals-data.json');
        const data = await response.json();
        chemicalData = data;  
        renderTable(chemicalData);  
    } catch (error) {
        console.error('Error fetching the chemical data:', error);
    }
}

function renderTable(data) {
    const tableBody = document.getElementById('chemical-table-body');
    tableBody.innerHTML = '';  

    data.forEach((chemical, index) => {
        const row = document.createElement('tr');

        row.innerHTML = `
            <td><img src = 'images/tick.svg' width="26px"></td>
            <td>${chemical.chemical_name}</td>
            <td>${chemical.vendor}</td>
            <td class="density">${chemical.density}</td>
            <td class="viscosity">${chemical.viscosity}</td>
            <td>${chemical.packaging}</td>
            <td>${chemical.pack_size}</td>
            <td>${chemical.unit}</td>
            <td class="quantity">${chemical.quantity}</td>
            <td><img src='images/edit.png' width="26px" class="edit-icon" data-index="${index}"></td>
        `;

        row.addEventListener('click', function () {
            highlightRow(this); 
        });

        tableBody.appendChild(row);
    });

    document.querySelectorAll('.edit-icon').forEach(icon => {
        icon.addEventListener('click', handleEditClick);
    });
}

function handleEditClick(event) {
    const index = event.target.getAttribute('data-index');
    const row = event.target.closest('tr');

    const densityCell = row.querySelector('.density');
    const viscosityCell = row.querySelector('.viscosity');
    const quantityCell = row.querySelector('.quantity');

    const densityValue = densityCell.textContent;
    const viscosityValue = viscosityCell.textContent;
    const quantityValue = quantityCell.textContent;

    densityCell.innerHTML = `<input type="text" value="${densityValue}" class="density-input">`;
    viscosityCell.innerHTML = `<input type="text" value="${viscosityValue}" class="viscosity-input">`;
    quantityCell.innerHTML = `<input type="text" value="${quantityValue}" class="quantity-input">`;

    event.target.outerHTML = `<button class="save-btn" data-index="${index}">Save</button>`;

    row.querySelector('.save-btn').addEventListener('click', handleSaveClick);
}

function handleSaveClick(event) {
    const index = event.target.getAttribute('data-index');
    const row = event.target.closest('tr');

    const densityInput = row.querySelector('.density-input').value;
    const viscosityInput = row.querySelector('.viscosity-input').value;
    const quantityInput = row.querySelector('.quantity-input').value;

    chemicalData[index].density = densityInput;
    chemicalData[index].viscosity = viscosityInput;
    chemicalData[index].quantity = quantityInput;

    row.querySelector('.density').innerHTML = densityInput;
    row.querySelector('.viscosity').innerHTML = viscosityInput;
    row.querySelector('.quantity').innerHTML = quantityInput;

    event.target.outerHTML = `<img src='images/edit.png' width="26px" class="edit-icon" data-index="${index}">`;

    row.querySelector('.edit-icon').addEventListener('click', handleEditClick);
}

function sortTable(column) {
    if (currentSortColumn === column) {
        currentSortDirection = currentSortDirection === 'asc' ? 'desc' : 'asc';
    } else {
        currentSortColumn = column;
        currentSortDirection = 'asc';
    }

    chemicalData.sort((a, b) => {
        let valueA = a[column];
        let valueB = b[column];

        if (!isNaN(valueA) && !isNaN(valueB)) {
            valueA = parseFloat(valueA);
            valueB = parseFloat(valueB);
        }

        if (currentSortDirection === 'asc') {
            return valueA > valueB ? 1 : valueA < valueB ? -1 : 0;
        } else {
            return valueA < valueB ? 1 : valueA > valueB ? -1 : 0;
        }
    });

    renderTable(chemicalData);
}


function highlightRow(row) {
    const rows = document.querySelectorAll('tr');
    rows.forEach(r => r.classList.remove('selected'));

    row.classList.add('selected');
    selectedRow = row; 
}


document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('chemical-name-header').addEventListener('click', () => sortTable('chemical_name'));
    document.getElementById('vendor-header').addEventListener('click', () => sortTable('vendor'));
    document.getElementById('density-header').addEventListener('click', () => sortTable('density'));
    document.getElementById('viscosity-header').addEventListener('click', () => sortTable('viscosity'));
    document.getElementById('packaging-header').addEventListener('click', () => sortTable('packaging'));
    document.getElementById('pack-size-header').addEventListener('click', () => sortTable('pack_size'));
    document.getElementById('unit-header').addEventListener('click', () => sortTable('unit'));
    document.getElementById('quantity-header').addEventListener('click', () => sortTable('quantity'));

    fetchChemicalData();
});
function deleteSelectedRow() {
    if (selectedRow) {
        selectedRow.remove();  
        selectedRow = null;   
    } else {
        alert("No row selected to delete!");  
    }
}

function moveRowUp() {
    if (selectedRow) {
        const previousRow = selectedRow.previousElementSibling; 
        if (previousRow) {
            selectedRow.parentNode.insertBefore(selectedRow, previousRow);
        }
        updateArrowButtonStates(); 
    } else {
        alert("No row selected to move up!");
    }
}

function moveRowDown() {
    if (selectedRow) {
        const nextRow = selectedRow.nextElementSibling; 
        if (nextRow) {
            selectedRow.parentNode.insertBefore(nextRow, selectedRow);
        }
        updateArrowButtonStates(); 
    } else {
        alert("No row selected to move down!");  
    }
}

function updateArrowButtonStates() {
    const upArrow = document.getElementById('up-arrow-image');
    const downArrow = document.getElementById('down-arrow-image');

    if (selectedRow) {
        upArrow.disabled = selectedRow === selectedRow.parentNode.firstElementChild; 
        downArrow.disabled = selectedRow === selectedRow.parentNode.lastElementChild; 
    } else {
        upArrow.disabled = true;  
        downArrow.disabled = true;  
    }
}

let isEditing = false; 

function addInputRow() {
    if (isEditing) {
        alert("Please save the current row before adding a new one.");
        return;
    }

    const tableBody = document.getElementById('chemical-table-body');
    const row = document.createElement('tr');
    row.innerHTML = `
        <td><img src = 'images/tick.svg' width="26px"></td>
        <td><input type="text" id="chemical-name" placeholder="Chemical Name"></td>
        <td><input type="text" id="vendor" placeholder="Vendor"></td>
        <td><input type="text" id="density" placeholder="Density"></td>
        <td><input type="text" id="viscosity" placeholder="Viscosity"></td>
        <td><input type="text" id="packaging" placeholder="Packaging"></td>
        <td><input type="text" id="pack-size" placeholder="Pack Size"></td>
        <td><input type="text" id="unit" placeholder="Unit"></td>
        <td><input type="number" id="quantity" placeholder="Quantity"></td>
    `;
    tableBody.appendChild(row);
    isEditing = true; 
}

function saveRowData() {
    if (!isEditing) {
        alert("No row to save.");
        return;
    }

    const chemicalName = document.getElementById('chemical-name').value;
    const vendor = document.getElementById('vendor').value;
    const density = document.getElementById('density').value;
    const viscosity = document.getElementById('viscosity').value;
    const packaging = document.getElementById('packaging').value;
    const packSize = document.getElementById('pack-size').value;
    const unit = document.getElementById('unit').value;
    const quantity = document.getElementById('quantity').value;

    if (!chemicalName || !vendor || !density || !viscosity || !packaging || !packSize || !unit || !quantity) {
        alert("Please fill in all fields before saving.");
        return;
    }

    const tableBody = document.getElementById('chemical-table-body');
    const lastRow = tableBody.lastChild;
    lastRow.innerHTML = `
        <td><input type="checkbox"></td>
        <td>${chemicalName}</td>
        <td>${vendor}</td>
        <td>${density}</td>
        <td>${viscosity}</td>
        <td>${packaging}</td>
        <td>${packSize}</td>
        <td>${unit}</td>
        <td>${quantity}</td>
    `;

    isEditing = false; 
}


function refreshTableData() {
    const tableBody = document.getElementById('chemical-table-body');
    tableBody.innerHTML = '';

    fetchChemicalData();
}

function addImageClickEvents() {
    document.getElementById('add-image').addEventListener('click', () => {
        console.log('Add button clicked');
        addInputRow();     });

    document.getElementById('down-arrow-image').addEventListener('click',moveRowDown);

    document.getElementById('up-arrow-image').addEventListener('click',()=>{
        moveRowUp();
    });

    const deleteButton = document.querySelector('img[alt="delete"]');  
    deleteButton.addEventListener('click', deleteSelectedRow);

    document.getElementById('load-image').addEventListener('click', () => {
        console.log('Load button clicked');
        refreshTableData(); 
    });

    document.getElementById('save-image').addEventListener('click', () => {
        console.log('Save button clicked');
        saveRowData(); 
    });
}

window.onload = () => {
    fetchChemicalData();
    addImageClickEvents();
};