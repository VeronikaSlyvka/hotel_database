const apiUrl = 'http://localhost:3000/rooms';

// Отримати всі кімнати
async function fetchRooms() {
  const response = await fetch(apiUrl);
  const rooms = await response.json();
  renderRooms(rooms);
}

// Створити нову кімнату
async function createRoom(event) {
  event.preventDefault();

  const capacity = document.getElementById('capacity').value;
  const comfort = document.getElementById('comfort').value;
  const price = document.getElementById('price').value;

  const response = await fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ capacity, comfort, price }),
  });

  if (response.ok) {
    alert('Room created');
    fetchRooms();  // Оновити список кімнат
  } else {
    alert('Error creating room');
  }
}

// Оновити кімнату
async function updateRoom(id) {
  const capacity = document.getElementById('capacity').value;
  const comfort = document.getElementById('comfort').value;
  const price = document.getElementById('price').value;

  const response = await fetch(`${apiUrl}/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ capacity, comfort, price }),
  });

  if (response.ok) {
    alert('Room updated');
    fetchRooms();  // Оновити список кімнат
  } else {
    alert('Error updating room');
  }
}

// Видалити кімнату
async function deleteRoom(id) {
  const response = await fetch(`${apiUrl}/${id}`, { method: 'DELETE' });

  if (response.ok) {
    alert('Room deleted');
    fetchRooms();  // Оновити список кімнат
  } else {
    alert('Error deleting room');
  }
}

// Відобразити кімнати
function renderRooms(rooms) {
    const roomList = document.getElementById('rooms-table-body'); // змінено на правильний id
    roomList.innerHTML = '';
    
    rooms.forEach(room => {
      const roomRow = document.createElement('tr'); // створюємо рядок таблиці
      roomRow.innerHTML = `
        <td>${room.RoomID}</td>
        <td>${room.Number}</td>
        <td>${room.Type}</td>
        <td>${room.Price}</td>
        <td>
          <button onclick="updateRoom(${room.RoomID})">Оновити</button>
          <button onclick="deleteRoom(${room.RoomID})">Видалити</button>
        </td>
      `;
      roomList.appendChild(roomRow); // додаємо рядок до таблиці
    });
  }
  

// Викликати функцію для отримання кімнат при завантаженні сторінки
fetchRooms();
