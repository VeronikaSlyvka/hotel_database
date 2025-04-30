const apiUrl = 'http://localhost:3000/invoices';

// Завантажити рахунки при завантаженні сторінки
document.addEventListener('DOMContentLoaded', loadInvoices);

// Завантаження списку рахунків
async function loadInvoices() {
  try {
    const res = await fetch(apiUrl);
    const invoices = await res.json();
    const tableBody = document.getElementById('invoices-table-body');
    tableBody.innerHTML = '';

    invoices.forEach(invoice => {
      const row = document.createElement('tr');

      row.innerHTML = `
        <td>${invoice.InvoiceID}</td>
        <td>${invoice.BookingID}</td>
        <td>${invoice.Amount}</td>
        <td>${invoice.PaymentStatus}</td>
        <td>${new Date(invoice.InvoiceDate).toLocaleDateString()}</td>
        <td>
          <button onclick="editInvoice(${invoice.InvoiceID}, ${invoice.BookingID}, ${invoice.Amount}, '${invoice.PaymentStatus}', '${invoice.InvoiceDate}')" class="edit-btn">Редагувати</button>
          <button onclick="deleteInvoice(${invoice.InvoiceID})" class="delete-btn">Видалити</button>
        </td>
      `;

      tableBody.appendChild(row);
    });

  } catch (error) {
    console.error('Помилка завантаження рахунків:', error);
  }
}

// Відкрити форму для додавання рахунку
function openAddForm() {
  document.getElementById('form-title').textContent = 'Додати рахунок';
  document.getElementById('invoiceId').value = '';
  document.getElementById('clientId').value = '';
  document.getElementById('amount').value = '';
  document.getElementById('status').value = '';
  document.getElementById('date').value = '';
  document.getElementById('invoice-form').classList.remove('hidden');
  document.getElementById('invoice-form').scrollIntoView({ behavior: 'smooth' });
}

// Відкрити форму для редагування рахунку
function editInvoice(id, bookingID, amount, paymentStatus, invoiceDate) {
  document.getElementById('form-title').textContent = 'Редагувати рахунок';
  document.getElementById('invoiceId').value = id;
  document.getElementById('clientId').value = bookingID;
  document.getElementById('amount').value = amount;
  document.getElementById('status').value = paymentStatus;
  document.getElementById('date').value = invoiceDate.split('T')[0];
  document.getElementById('invoice-form').classList.remove('hidden');
  document.getElementById('invoice-form').scrollIntoView({ behavior: 'smooth' });
}

// Закрити форму
function closeForm() {
  document.getElementById('invoice-form').classList.add('hidden');
  document.getElementById('invoiceId').value = '';
  document.getElementById('clientId').value = '';
  document.getElementById('amount').value = '';
  document.getElementById('status').value = '';
  document.getElementById('date').value = '';
}

// Зберегти рахунок (новий або оновлений)
async function saveInvoice(event) {
  event.preventDefault();

  const id = document.getElementById('invoiceId').value;
  const invoice = {
    bookingID: document.getElementById('invoiceId').value,
    amount: document.getElementById('amount').value,
    paymentStatus: document.getElementById('status').value,
    invoiceDate: document.getElementById('date').value
  };

  try {
    const res = await fetch(id ? `${apiUrl}/${id}` : apiUrl, {
      method: id ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(invoice)
    });

    if (!res.ok) throw new Error('Помилка при збереженні рахунку');

    closeForm();
    loadInvoices();
  } catch (error) {
    console.error('Помилка при збереженні:', error);
  }
}

// Видалити рахунок
async function deleteInvoice(id) {
  if (!confirm('Ви впевнені, що хочете видалити цей рахунок?')) return;

  try {
    const res = await fetch(`${apiUrl}/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Помилка при видаленні');
    loadInvoices();
  } catch (error) {
    console.error('Помилка при видаленні рахунку:', error);
  }
}
