const apiUrl = 'http://localhost:3000/bookings';

// Завантажити бронювання при завантаженні сторінки
document.addEventListener('DOMContentLoaded', loadBookings);

document.getElementById('roomForm').addEventListener('submit', function (e) {
  e.preventDefault(); // Запобігає перезавантаженню сторінки
  saveRoom();
});


// Завантаження списку бронювань
async function loadBookings() {
  try {
    const res = await fetch(apiUrl);
    const bookings = await res.json();
    const tableBody = document.getElementById('bookings-table-body');
    tableBody.innerHTML = '';

    bookings.forEach(booking => {
      const row = document.createElement('tr');

      row.innerHTML = `
        <td>${booking.BookingID}</td>
        <td>${booking.ClientID}</td>
        <td>${booking.RoomID}</td>
        <td>${booking.CheckIN}</td>
        <td>${booking.CheckOut}</td>
        <td>
          <button onclick="editBooking(${booking.BookingID}, ${booking.ClientID}, ${booking.RoomID}, '${booking.CheckIN}', '${booking.CheckOut}')" class="edit-btn">Редагувати</button>
          <button onclick="deleteBooking(${booking.BookingID})" class="delete-btn">Видалити</button>
        </td>
      `;

      tableBody.appendChild(row);
    });

  } catch (error) {
    console.error('Помилка завантаження бронювань:', error);
  }
}

// Відкрити форму для додавання нового бронювання
function openAddForm() {
  document.getElementById('form-title').textContent = 'Додати бронювання';
  document.getElementById('bookingId').value = '';
  document.getElementById('clientId').value = '';
  document.getElementById('roomId').value = '';
  document.getElementById('dateFrom').value = '';
  document.getElementById('dateTo').value = '';
  document.getElementById('booking-form').classList.remove('hidden');

  document.getElementById('booking-form').scrollIntoView({ behavior: 'smooth' });
}

// Відкрити форму для редагування бронювання
function editBooking(id, clientID, roomID, checkIN, checkOut) {
  document.getElementById('form-title').textContent = 'Редагувати бронювання';
  document.getElementById('bookingId').value = id;
  document.getElementById('clientId').value = clientID;
  document.getElementById('roomId').value = roomID;
  document.getElementById('dateFrom').value = checkIN;
  document.getElementById('dateTo').value = checkOut;
  document.getElementById('booking-form').classList.remove('hidden');

  document.getElementById('booking-form').scrollIntoView({ behavior: 'smooth' });
}

// Закрити форму та очистити поля
function closeForm() {
  document.getElementById('booking-form').classList.add('hidden');
  document.getElementById('bookingId').value = '';
  document.getElementById('clientId').value = '';
  document.getElementById('roomId').value = '';
  document.getElementById('dateFrom').value = '';
  document.getElementById('dateTo').value = '';
}


// Зберегти бронювання (додати або оновити)
async function saveBooking() {
  const id = document.getElementById('bookingId').value;
  const clientID = document.getElementById('clientId').value;
  const roomID = document.getElementById('roomId').value;
  const checkIN = document.getElementById('dateFrom').value;
  const checkOut = document.getElementById('dateTo').value;

  const bookingData = { clientID, roomID, checkIN, checkOut };

  try {
    if (id) {
      // Оновити
      await fetch(`${apiUrl}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookingData)
      });
    } else {
      // Додати нове
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

// Видалити бронювання
async function deleteBooking(id) {
  if (!confirm('Ви впевнені, що хочете видалити це бронювання?')) return;

  try {
    await fetch(`${apiUrl}/${id}`, {
      method: 'DELETE'
    });
    loadBookings();
  } catch (error) {
    console.error('Помилка видалення бронювання:', error);
  }
}
