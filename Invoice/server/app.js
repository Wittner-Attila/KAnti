import express from 'express';
import cors from 'cors';
import * as db from './util/database.js';

const port = 3000;
const app = express();
app.use(cors());
app.use(express.json());

// #region Customers
app.get('/customers', (req, res) => {
  const customers = db.getCustomers();
  res.json(customers);
});
app.get('/customers/:id', (req, res) => {
  const id = req.params.id;
  const customer = db.getCustomer(id);
  if (customer) {
    res.json(customer);
  } else {
    res.status(404).json({ message: 'Customer not found' });
  }
});
app.post('/customers', (req, res) => {
  const { name, taxcode, address } = req.body;
  db.postCustomer(name, taxcode, address);
  res.status(201).json({ message: 'Customer created' });
});
app.put('/customers/:id', (req, res) => {
  const id = req.params.id;
  const { name, taxcode, address } = req.body;
  db.changeCustomer(id, name, taxcode, address);
  res.json({ message: 'Customer updated' });
});
app.delete('/customers/:id', (req, res) => {
  const id = req.params.id;
  db.deleteCustomer(id);
  res.json({ message: 'Customer deleted' });
});
// #endregion 

// #region Invoices
app.get('/invoices', (req, res) => {
  const invoices = db.getInvoices();
  res.json(invoices);
});
app.get('/invoices/:id', (req, res) => {
  const id = req.params.id;
  const Invoice = db.getInvoice(id);
  if (Invoice) {
    res.json(Invoice);
  } else {
    res.status(404).json({ message: 'Invoice not found' });
  }
});
app.post('/invoices', (req, res) => {
  const { vendorId, customerId, invoiceNumber, date, dueDate, total, vat, payDate } = req.body;
  db.postInvoice(vendorId, customerId, invoiceNumber, date, dueDate, total, vat, payDate);
  res.status(201).json({ message: 'Invoice created' });
});
app.put('/invoices/:id', (req, res) => {
  const id = req.params.id;
  db.stornoInvoice(id);
  res.json({ message: 'Invoice stornoed' });
});
// #endregion

// #region Vendors
app.get('/vendors', (req, res) => {
  const vendors = db.getVendors();
  res.json(vendors);
});

app.get('/vendors/:id', (req, res) => {
  const id = req.params.id;
  const vendor = db.getVendor(id);
  if (vendor) {
    res.json(vendor);
  } else {
    res.status(404).json({ message: 'Vendor not found' });
  }
});

app.post('/vendors', (req, res) => {
  const { name, taxcode, address } = req.body;
  db.postVendor(name, taxcode, address);
  res.status(201).json({ message: 'Vendor created' });
});

app.put('/vendors/:id', (req, res) => {
  const id = req.params.id;
  const { name, taxcode, address } = req.body;
  db.changeVendor(id, name, taxcode, address);
  res.json({ message: 'Vendor updated' });
});

app.delete('/vendors/:id', (req, res) => {
  const id = req.params.id;
  db.deleteVendor(id);
  res.json({ message: 'Vendor deleted' });
});
// #endregion

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
  db.setupDB();
});
