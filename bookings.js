const apiUrl = 'http://localhost:3000/bookings';

document.addEventListener('DOMContentLoaded', async () => {
  await loadClientsAndRooms();
  loadBookings();

  document.getElementById('bookingForm').addEventListener('submit', function (e) {
    e.preventDefault();
    saveBooking();
  });
}); 

let clientChoices, roomChoices;

async function loadClientsAndRooms() {
  const [clientsRes, roomsRes] = await Promise.all([
    fetch('http://localhost:3000/clients'),
    fetch('http://localhost:3000/rooms')
  ]);

  const clients = await clientsRes.json();
  const rooms = await roomsRes.json();

  const clientSelect = document.getElementById('clientId');
  const roomSelect = document.getElementById('roomId');

  clientSelect.innerHTML = clients.map(c =>
    `<option value="${c.ClientID}">${c.FullName}</option>`).join('');

  roomSelect.innerHTML = rooms.map(r =>
    `<option value="${r.RoomID}">Кімната ${r.RoomID} (${r.Comfort})</option>`).join('');

  // Ініціалізація Choices.js
  if (clientChoices) clientChoices.destroy();
  if (roomChoices) roomChoices.destroy();

  clientChoices = new Choices(clientSelect, { searchEnabled: true });
  roomChoices = new Choices(roomSelect, { searchEnabled: true });
}

async function loadBookings() {
  try {
    const [bookingsRes, clientsRes, roomsRes] = await Promise.all([
      fetch(apiUrl),
      fetch('http://localhost:3000/clients'),
      fetch('http://localhost:3000/rooms')
    ]);

    const bookings = await bookingsRes.json();
    const clients = await clientsRes.json();
    const rooms = await roomsRes.json();

    const tableBody = document.getElementById('bookings-table-body');
    tableBody.innerHTML = '';

    bookings.forEach(booking => {
      const client = clients.find(c => c.ClientID === booking.ClientID);
      const room = rooms.find(r => r.RoomID === booking.RoomID);

      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${booking.BookingID}</td>
        <td>${client ? client.FullName : 'Невідомо'}</td>
        <td>${room ? `Кімната ${room.RoomID} (${room.Comfort})` : booking.RoomID}</td>
        <td>${booking.CheckIn ? booking.CheckIn.slice(0, 10) : ''}</td>
        <td>${booking.CheckOut ? booking.CheckOut.slice(0, 10) : ''}</td>
        <td>
          <button onclick="editBooking(${booking.BookingID}, ${booking.ClientID}, ${booking.RoomID}, '${booking.CheckIn}', '${booking.CheckOut}')" class="edit-btn">Редагувати</button>
          <button onclick="deleteBooking(${booking.BookingID})" class="delete-btn">Видалити</button>
        </td>
      `;
      tableBody.appendChild(row);
    });
  } catch (error) {
    console.error('Помилка завантаження бронювань:', error);
  }
}

function openAddForm() {
  document.getElementById('form-title').textContent = 'Додати бронювання';
  document.getElementById('bookingId').value = '';
  clientChoices.setChoiceByValue('');
  roomChoices.setChoiceByValue('');
  document.getElementById('dateFrom').value = '';
  document.getElementById('dateTo').value = '';
  document.getElementById('booking-form').classList.remove('hidden');
  document.getElementById('booking-form').scrollIntoView({ behavior: 'smooth' });
}

function editBooking(id, clientID, roomID, checkIn, checkOut) {
  document.getElementById('form-title').textContent = 'Редагувати бронювання';
  document.getElementById('bookingId').value = id;
  clientChoices.setChoiceByValue(clientID.toString());
  roomChoices.setChoiceByValue(roomID.toString());
  document.getElementById('dateFrom').value = checkIn.slice(0, 10);
  document.getElementById('dateTo').value = checkOut.slice(0, 10);
  document.getElementById('booking-form').classList.remove('hidden');
  document.getElementById('booking-form').scrollIntoView({ behavior: 'smooth' });
}

function closeForm() {
  document.getElementById('booking-form').classList.add('hidden');
  document.getElementById('bookingId').value = '';
  clientChoices.setChoiceByValue('');
  roomChoices.setChoiceByValue('');
  document.getElementById('dateFrom').value = '';
  document.getElementById('dateTo').value = '';
}

async function saveBooking() {
  const id = document.getElementById('bookingId').value;
  const clientID = document.getElementById('clientId').value;
  const roomID = document.getElementById('roomId').value;
  const checkIn = document.getElementById('dateFrom').value;
  const checkOut = document.getElementById('dateTo').value;

  const bookingData = {
    clientID: parseInt(clientID),
    roomID: parseInt(roomID),
    checkIn: checkIn,
    checkOut: checkOut
  };


  try {
    if (id) {
      await fetch(`${apiUrl}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookingData)
      });
    } else {
      await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookingData)
      });
    }

    closeForm();
    loadBookings();
  } catch (error) {
    console.error('Помилка збереження бронювання:', error);
  }
}

async function deleteBooking(id) {
  if (!confirm("Ви впевнені, що хочете видалити це бронювання? При видаленні бронювання видаляться також всі рахунки, пов'язані з цим бронюванням.")) return;

  try {
    await fetch(`${apiUrl}/${id}`, {
      method: 'DELETE'
    });
    loadBookings();
  } catch (error) {
    console.error('Помилка видалення бронювання:', error);
  }
}
