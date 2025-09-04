import Database from "better-sqlite3";

const db = new Database("./data/database.sql");

export const setupDB = () => {
    db.prepare(`
    CREATE TABLE IF NOT EXISTS vendor (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL ,
        taxcode TEXT NOT NULL UNIQUE,
        address TEXT NOT NULL
    );`).run();
    db.prepare(`
    INSERT OR IGNORE INTO vendor (name, taxcode, address)
    VALUES ('testVendor', '12345678-1-23', '6758 Röszke, Petőfi Sándor utca, 14.'),
           ('Ubisoft', '12453678-1-23', '6725 Szeged, Kossuth Lajos sugárút, 10.'),
           ('Rockstar Games', '23456178-1-23', '6720 Szeged, Tisza Lajos körút, 5.'),
           ('Electronic Arts', '51236784-1-23', '6722 Szeged, Kálvária sugárút, 8.'),
           ('Activision Blizzard', '34567281-1-23', '6723 Szeged, Szent István tér, 1.'),
           ('Valve Corporation', '81234567-1-23', '6724 Szeged, Petőfi Sándor sugárút, 12.');
    `).run();

    db.prepare(`
    CREATE TABLE IF NOT EXISTS customer (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        taxcode TEXT NOT NULL UNIQUE,
        address TEXT NOT NULL
    );`).run();
    db.prepare(`
    INSERT OR IGNORE INTO customer (name, taxcode, address)
    VALUES ('testCustomer', '87654321-1-23', '6720 Szeged, Kossuth Lajos sugárút, 20.'),
           ('Epic Games', '12345678-2-34', '6721 Szeged, Tisza Lajos körút, 15.'),
           ('CD Projekt Red', '23456789-2-34', '6722 Szeged, Kálvária sugárút, 25.'),
           ('Bethesda Softworks', '34567890-2-34', '6723 Szeged, Szent István tér, 30.'),
           ('Square Enix', '45678901-2-34', '6724 Szeged, Petőfi Sándor sugárút, 40.');
    `).run();

    db.prepare(`
    CREATE TABLE IF NOT EXISTS invoice (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        vendorId INTEGER NOT NULL,
        customerId INTEGER NOT NULL,
        invoiceNumber TEXT NOT NULL UNIQUE,
        date TEXT NOT NULL,
        payDate TEXT,
        dueDate TEXT NOT NULL,
        total REAL NOT NULL,
        vat REAL NOT NULL,
        storno BINARY NOT NULL,
        FOREIGN KEY (vendorId) REFERENCES vendor(id) ON DELETE CASCADE,
        FOREIGN KEY (customerId) REFERENCES customer(id) ON DELETE CASCADE
    );`).run();

const vendors = getVendors(); // returns rows with .id
const customers = getCustomers(); // same

const invoices = [
    { vendorName: 'Ubisoft', customerName: 'Epic Games', invoiceNumber: '2023/001', date: '2023-10-01', payDate: '2023-10-05', dueDate: '2023-10-15', total: 100.00, vat: 27.00 },
    { vendorName: 'Rockstar Games', customerName: 'CD Projekt Red', invoiceNumber: '2023/002', date: '2023-10-02', payDate: '2023-10-06', dueDate: '2023-10-16', total: 200.00, vat: 54.00 },
    { vendorName: 'Electronic Arts', customerName: 'Bethesda Softworks', invoiceNumber: '2023/003', date: '2023-10-03', payDate: '2023-10-07', dueDate: '2023-10-17', total: 300.00, vat: 81.00 },
];

for (const invoice of invoices) {
    const vendor = vendors.find(v => v.name === invoice.vendorName);
    const customer = customers.find(c => c.name === invoice.customerName);

    if (vendor && customer) {
        db.prepare(`
            INSERT OR IGNORE INTO invoice 
            (vendorId, customerId, invoiceNumber, date, payDate, dueDate, total, vat)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `).run(vendor.id,customer.id,invoice.invoiceNumber,invoice.date,invoice.payDate,invoice.dueDate,invoice.total,invoice.vat);
    }
}
}

export const getVendors = () => {
    return db.prepare("SELECT * FROM vendor").all();
}

export const getVendor = (id) => {
    return db.prepare("SELECT * FROM vendor WHERE id = ?").get(id);
}

export const postVendor = (name, taxcode, address) => {
    return db.prepare("INSERT INTO vendor (name, taxcode, address) VALUES (?, ?, ?)").run(name, taxcode, address);
}

export const changeVendor = (id, name, taxcode, address) => {
    return db.prepare("UPDATE vendor SET name = ?, taxcode = ?, address = ? WHERE id = ?").run(name, taxcode, address, id);
}

export const deleteVendor = (id) => {
    return db.prepare("DELETE FROM vendor WHERE id = ?").run(id);
}



export const getCustomers = () => {
    return db.prepare("SELECT * FROM customer").all();
}

export const getCustomer = (id) => {
    return db.prepare("SELECT * FROM customer WHERE id = ?").get(id);
}

export const postCustomer = (name, taxcode, address) => {
    return db.prepare("INSERT INTO customer (name, taxcode, address) VALUES (?, ?, ?)").run(name, taxcode, address);
}

export const changeCustomer = (id, name, taxcode, address) => {
    return db.prepare("UPDATE customer SET name = ?, taxcode = ?, address = ? WHERE id = ?").run(name, taxcode, address, id);
}

export const deleteCustomer = (id) => {
    return db.prepare("DELETE FROM customer WHERE id = ?").run(id);
}




export const getInvoices = () => {
    return db.prepare(`
        SELECT r.*, v.name AS vendorName, c.name AS customerName
        FROM invoice r
        JOIN vendor v ON r.vendorId = v.id
        JOIN customer c ON r.customerId = c.id
    `).all();
}
export const getInvoice = (id) => {
    return db.prepare(`
        SELECT r.*, v.name AS vendorName, c.name AS customerName
        FROM invoice r
        JOIN vendor v ON r.vendorId = v.id
        JOIN customer c ON r.customerId = c.id
        WHERE r.id = ?
    `).get(id);
}
export const postInvoice = (vendorId, customerId, invoiceNumber, date, dueDate, total, vat, payDate = null) => {
    return db.prepare(`
        INSERT INTO invoice (vendorId, customerId, invoiceNumber, date, dueDate, total, vat, payDate)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(vendorId, customerId, invoiceNumber, date, dueDate, total, vat, payDate);
}
export const stornoInvoice = (id) => {
    return db.prepare(`
        UPDATE invoice
        storno = 1 
        WHERE id = ?
    `).run(id);
}