const apiUrl = 'http://localhost:3000/invoices';
let bookings = [], clients = [], rooms = [], bookingChoices;

document.addEventListener('DOMContentLoaded', async () => {
  await loadDependencies();
  loadInvoices();

  document.getElementById('invoiceForm').addEventListener('submit', function (e) {
    e.preventDefault();
    saveInvoice();
  });

  document.getElementById('bookingId').addEventListener('change', updateAmount);
});

async function loadDependencies() {
  const [bookingsRes, clientsRes, roomsRes] = await Promise.all([
    fetch('http://localhost:3000/bookings'),
    fetch('http://localhost:3000/clients'),
    fetch('http://localhost:3000/rooms')
  ]);

  bookings = await bookingsRes.json();
  clients = await clientsRes.json();
  rooms = await roomsRes.json();

  const bookingSelect = document.getElementById('bookingId');
  bookingSelect.innerHTML = bookings.map(b => {
    const client = clients.find(c => c.ClientID === b.ClientID);
    return `<option value="${b.BookingID}">${b.BookingID} (${client ? client.FullName : 'Невідомо'})</option>`;
  }).join('');

  if (bookingChoices) bookingChoices.destroy();
  bookingChoices = new Choices(bookingSelect, { searchEnabled: true });
}


async function loadInvoices() {
  try {
    const res = await fetch(apiUrl);
    const invoices = await res.json();

    const tableBody = document.getElementById('invoices-table-body');
    tableBody.innerHTML = '';

    invoices.forEach(invoice => {
      const booking = bookings.find(b => b.BookingID === invoice.BookingID);
      const client = clients.find(c => c.ClientID === (booking ? booking.ClientID : null));

      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${invoice.InvoiceID}</td>
        <td>${invoice.BookingID} (${client ? client.FullName : 'Невідомо'})</td>
        <td>${invoice.InvoiceDate ? invoice.InvoiceDate.slice(0, 10) : ''}</td>
        <td>${invoice.Amount} грн</td>
        <td>${invoice.PaymentStatus}</td>
        <td>
          <button class="edit-btn" data-id="${invoice.InvoiceID}">Редагувати</button>
          <button class="delete-btn" data-id="${invoice.InvoiceID}">Видалити</button>
        </td>
      `;
      tableBody.appendChild(row);
    });

    document.querySelectorAll('.edit-btn').forEach(button => {
      button.addEventListener('click', function () {
        editInvoice(this.dataset.id);
      });
    });

    document.querySelectorAll('.delete-btn').forEach(button => {
      button.addEventListener('click', function () {
        deleteInvoice(this.dataset.id);
      });
    });

  } catch (error) {
    console.error('Помилка завантаження рахунків:', error);
  }
}


function updateAmount() {
  const bookingID = parseInt(document.getElementById('bookingId').value);
  const booking = bookings.find(b => b.BookingID === bookingID);
  if (!booking) return;

  const room = rooms.find(r => r.RoomID === booking.RoomID);
  const checkIn = new Date(booking.CheckIn);
  const checkOut = new Date(booking.CheckOut);
  const days = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));

  const amount = days * parseFloat(room.Price);
  document.getElementById('amountDisplay').textContent = `Сума: ${amount.toFixed(2)} грн`;
  document.getElementById('calculatedAmount').value = amount.toFixed(2);
}

function openAddForm() {
  document.getElementById('form-title').textContent = 'Додати рахунок';
  document.getElementById('invoiceId').value = '';
  bookingChoices.setChoiceByValue('');
  document.getElementById('date').value = '';
  document.getElementById('status').value = 'сплачено';
  document.getElementById('amountDisplay').textContent = 'Сума: 0 грн';
  document.getElementById('calculatedAmount').value = '';
  document.getElementById('invoice-form').classList.remove('hidden');
  document.getElementById('invoice-form').scrollIntoView({ behavior: 'smooth' });
}

async function editInvoice(id) {
  try {
    const res = await fetch(`${apiUrl}/${id}`);
    const invoice = await res.json();

    document.getElementById('form-title').textContent = 'Редагувати рахунок';
    document.getElementById('invoiceId').value = invoice.InvoiceID;
    bookingChoices.setChoiceByValue(invoice.BookingID.toString());
    document.getElementById('date').value = invoice.InvoiceDate.slice(0, 10);
    document.getElementById('status').value = invoice.PaymentStatus;
    document.getElementById('calculatedAmount').value = invoice.Amount;
    document.getElementById('amountDisplay').textContent = `Сума: ${invoice.Amount} грн`;
    document.getElementById('invoice-form').classList.remove('hidden');
    document.getElementById('invoice-form').scrollIntoView({ behavior: 'smooth' });
  } catch (error) {
    console.error('Помилка редагування рахунку:', error);
  }
}

async function deleteInvoice(id) {
  if (!confirm('Ви впевнені, що хочете видалити цей рахунок?')) return;

  try {
    await fetch(`${apiUrl}/${id}`, { method: 'DELETE' });
    loadInvoices();  // Після видалення перезавантажуємо таблицю
  } catch (error) {
    console.error('Помилка видалення рахунку:', error);
  }
}

function closeForm() {
  document.getElementById('invoice-form').classList.add('hidden');
  document.getElementById('invoiceForm').reset();
  document.getElementById('amountDisplay').textContent = 'Сума: 0 грн';
  bookingChoices.setChoiceByValue('');
}

async function saveInvoice() {
  const id = document.getElementById('invoiceId').value;
  const bookingID = document.getElementById('bookingId').value;
  const invoiceDate = document.getElementById('date').value;
  const paymentStatus = document.getElementById('status').value;
  const amount = parseFloat(document.getElementById('calculatedAmount').value);

  const invoiceData = {
    bookingID: parseInt(bookingID),
    invoiceDate,
    paymentStatus,
    amount
  };

  try {
    if (id) {
      await fetch(`${apiUrl}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(invoiceData)
      });
    } else {
      await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(invoiceData)
      });
    }

    closeForm();
    loadInvoices();
  } catch (error) {
    console.error('Помилка збереження рахунку:', error);
  }
}
