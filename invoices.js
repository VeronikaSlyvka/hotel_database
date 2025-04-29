// invoices.js

const apiUrl = 'http://localhost:3000/invoices';

// Отримати всі рахунки
async function fetchInvoices() {
  const response = await fetch(apiUrl);
  const invoices = await response.json();
  renderInvoices(invoices);
}

// Додати рахунок
async function createInvoice(event) {
  event.preventDefault();

  const bookingID = document.getElementById('bookingID').value;
  const amount = document.getElementById('amount').value;
  const paymentStatus = document.getElementById('paymentStatus').value;
  const invoiceDate = document.getElementById('invoiceDate').value;

  const response = await fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ bookingID, amount, paymentStatus, invoiceDate }),
  });

  if (response.ok) {
    alert('Invoice created');
    fetchInvoices();  // Оновити список рахунків
  } else {
    alert('Error creating invoice');
  }
}

// Оновити рахунок
async function updateInvoice(id) {
  const bookingID = document.getElementById('bookingID').value;
  const amount = document.getElementById('amount').value;
  const paymentStatus = document.getElementById('paymentStatus').value;
  const invoiceDate = document.getElementById('invoiceDate').value;

  const response = await fetch(`${apiUrl}/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ bookingID, amount, paymentStatus, invoiceDate }),
  });

  if (response.ok) {
    alert('Invoice updated');
    fetchInvoices();  // Оновити список рахунків
  } else {
    alert('Error updating invoice');
  }
}

// Видалити рахунок
async function deleteInvoice(id) {
  const response = await fetch(`${apiUrl}/${id}`, { method: 'DELETE' });

  if (response.ok) {
    alert('Invoice deleted');
    fetchInvoices();  // Оновити список рахунків
  } else {
    alert('Error deleting invoice');
  }
}

// Відобразити рахунки
function renderInvoices(invoices) {
    const invoiceList = document.getElementById('invoices-table-body');
    invoiceList.innerHTML = '';  // Clear existing table content
  
    invoices.forEach(invoice => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${invoice.InvoiceID}</td>
        <td>${invoice.ClientID}</td>
        <td>${invoice.Amount}</td>
        <td>${invoice.PaymentStatus}</td>
        <td>
          <button onclick="updateInvoice(${invoice.InvoiceID})">Update</button>
          <button onclick="deleteInvoice(${invoice.InvoiceID})">Delete</button>
        </td>
      `;
      invoiceList.appendChild(row);
    });
  }
  

// Викликати функцію для отримання рахунків при завантаженні сторінки
fetchInvoices();
