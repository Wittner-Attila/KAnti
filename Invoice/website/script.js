let invoices = [];
let customers = [];
let vendors = [];

function displayInvoice(invoice) {
    let customerName = (customers.find(c => c.id == invoice.customerId) || {}).name || 'Unknown Customer';
    let vendorName = (vendors.find(v => v.id == invoice.vendorId) || {}).name || 'Unknown Customer';
    return `
        <div class="content-box">
            <div class="content-header">
                <strong>Customer:</strong>${customerName} <br> <strong>Vendor:</strong>${vendorName}<br>
                <div>${invoice.invoiceNumber}</div>
            </div>
            <ul>
                <li><strong>Invoice Date:</strong> ${invoice.date}</li>
                <li><strong>Due Date:</strong> ${invoice.dueDate}</li>
                <li><strong>Amount:</strong> ${invoice.total} (VAT:${invoice.vat}%)</li>
                <li><strong>Pay Date:</strong> ${invoice.payDate}</li>
            </ul>
            <button class="delete-button" onclick="stornoInvoice(${invoice.id})">Delete</button>
            <button class="edit-button" onclick="editInvoice(${invoice.id})">Edit</button>
        </div>
        `;
}

function displayCustomer(customer) {
    return `
        <div class="content-box">
            <div class="content-header">
                <button class="delete-button" onclick="deleteVendor(${customer.id})">Delete</button>
                <button class="edit-button" onclick="window.location.href='customer.html?id=${customer.id}'">Edit</button>
                <br>
                <strong>${customer.name}</strong>
            </div>
            <ul>
                <li><strong>Address:</strong> ${customer.address}</li>
                <li><strong>Tax Code:</strong> ${customer.taxcode}</li>
            </ul>
        </div>
    `;
}

function displayVendor(vendor) {
    return `
        <div class="content-box">
            <div class="content-header">
                <button class="delete-button" onclick="deleteVendor(${vendor.id})">Delete</button>
                <button class="edit-button" onclick="window.location.href='vendor.html?id=${vendor.id}'">Edit</button>
                <br>
                <strong>${vendor.name}</strong>
            </div>
            <ul>
                <li><strong>Address:</strong> ${vendor.address}</li>
                <li><strong>Tax Code:</strong> ${vendor.taxcode}</li>
            </ul>
        </div>
    `;
}

document.addEventListener('DOMContentLoaded', async () => {
    const buttons = document.querySelectorAll('.header-button');
    await loadData();
    fillContent(invoices);
    buttons.forEach((button, idx) => {
        button.addEventListener('click', () => {
            if (idx == 0) {
                fillContent(invoices);
            } else if (idx == 1) {
                fillContent(vendors, 'vendors');
            } else if (idx == 2) {
                fillContent(customers, 'customers');
            }
        });
    });
});

function fillContent(types, contentType = 'invoices') {
    document.getElementById('content').innerHTML = `
    <div class="content-box">
        <div class="content-header">
            ADD NEW
        </div>
        <button class="add-button" onclick="window.location.href='invoice.html'">Add Invoice</button>
        <button class="add-button" onclick="window.location.href='vendor.html'">Add Vendor</button>
        <button class="add-button" onclick="window.location.href='Customer.html'">Add Customer</button>
    </div>`;
    if (contentType === 'customers') {
        types.forEach(customer => {
            document.getElementById('content').innerHTML += displayCustomer(customer);
        });
        return;
    } else if (contentType === 'vendors') {
        types.forEach(vendor => {
            document.getElementById('content').innerHTML += displayVendor(vendor);
        });
        return;
    }
    types.forEach(type => {
        document.getElementById('content').innerHTML += displayInvoice(type);
    });
}

async function loadData() {
    await fetch('http://localhost:3000/invoices')
        .then(response => response.json())
        .then(data => {
            invoices = data;
        })
        .catch(error => console.error('Error loading invoices:', error));

    await fetch('http://localhost:3000/customers')
        .then(response => response.json())
        .then(data => {
            customers = data;
        })
        .catch(error => console.error('Error loading customers:', error));

    await fetch('http://localhost:3000/vendors')
        .then(response => response.json())
        .then(data => {
            vendors = data;
        })
        .catch(error => console.error('Error loading vendors:', error));
}

async function stornoInvoice(id) {
    await fetch('http://localhost:3000/invoices/' + id, {
        method: 'PUT'
    }).then(async response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        await loadData();
        fillContent(invoices);
    }).catch(error => {
        console.error('Error stornoing invoice:', error);
        alert('Error stornoing invoice: ' + error.message);
    });
}

function deleteVendor(id) {
    fetch('http://localhost:3000/vendors/' + id, {
        method: 'DELETE'
    }).then(async response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        await loadData();
        fillContent(vendors, 'vendors');
    }).catch(error => {
        console.error('Error deleting vendor:', error);
        alert('Error deleting vendor: ' + error.message);
    });
}

function deleteCustomer(id) {
    fetch('http://localhost:3000/customers/' + id, {
        method: 'DELETE'
    }).then(async response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        await loadData();
        fillContent(customers, 'customers');
    }).catch(error => {
        console.error('Error deleting customer:', error);
        alert('Error deleting customer: ' + error.message);
    });
}

function editInvoice(id) {
    window.location.href = 'invoice.html?id=' + id;
}