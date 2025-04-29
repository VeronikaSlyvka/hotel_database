// bookings.js

const apiUrl = 'http://localhost:3000/bookings';

// Отримати всі бронювання
async function fetchBookings() {
  const response = await fetch(apiUrl);
  const bookings = await response.json();
  renderBookings(bookings);
}

// Додати нове бронювання
async function createBooking(event) {
  event.preventDefault();

  const clientID = document.getElementById('clientID').value;
  const roomID = document.getElementById('roomID').value;
  const checkIN = document.getElementById('checkIN').value;
  const checkOut = document.getElementById('checkOut').value;

  const response = await fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ clientID, roomID, checkIN, checkOut }),
  });

  if (response.ok) {
    alert('Booking created');
    fetchBookings();  // Оновити список бронювань
  } else {
    alert('Error creating booking');
  }
}

// Оновити бронювання
async function updateBooking(id) {
  const clientID = document.getElementById('clientID').value;
  const roomID = document.getElementById('roomID').value;
  const checkIN = document.getElementById('checkIN').value;
  const checkOut = document.getElementById('checkOut').value;

  const response = await fetch(`${apiUrl}/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ clientID, roomID, checkIN, checkOut }),
  });

  if (response.ok) {
    alert('Booking updated');
    fetchBookings();  // Оновити список бронювань
  } else {
    alert('Error updating booking');
  }
}

// Видалити бронювання
async function deleteBooking(id) {
  const response = await fetch(`${apiUrl}/${id}`, { method: 'DELETE' });

  if (response.ok) {
    alert('Booking deleted');
    fetchBookings();  // Оновити список бронювань
  } else {
    alert('Error deleting booking');
  }
}

function renderBookings(bookings) {
    const bookingList = document.getElementById('bookings-table-body');
    bookingList.innerHTML = '';  // Clear existing table content
  
    bookings.forEach(booking => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${booking.BookingID}</td>
        <td>${booking.ClientID}</td>
        <td>${booking.RoomID}</td>
        <td>${booking.CheckIN}</td>
        <td>${booking.CheckOut}</td>
        <td>
          <button onclick="updateBooking(${booking.BookingID})">Update</button>
          <button onclick="deleteBooking(${booking.BookingID})">Delete</button>
        </td>
      `;
      bookingList.appendChild(row);
    });
  }
  

// Викликати функцію для отримання бронювань при завантаженні сторінки
fetchBookings();
