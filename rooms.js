const apiUrl = 'http://localhost:3000/rooms';

// Завантажити кімнати при завантаженні сторінки
document.addEventListener('DOMContentLoaded', loadRooms);
document.getElementById('roomForm').addEventListener('submit', function (e) {
  e.preventDefault(); // Запобігає перезавантаженню сторінки
  saveRoom();
});


// Завантаження списку кімнат
async function loadRooms() {
  try {
    const res = await fetch(apiUrl);
    const rooms = await res.json();
    const tableBody = document.getElementById('rooms-table-body');
    tableBody.innerHTML = '';

    rooms.forEach(room => {
      const row = document.createElement('tr');

      row.innerHTML = `
        <td>${room.RoomID}</td>
        <td>${room.Capacity}</td>
        <td>${room.Comfort}</td>
        <td>${room.Price}</td>
        <td>
          <button onclick="editRoom(${room.RoomID}, ${room.Capacity}, '${room.Comfort}', ${room.Price})" class="edit-btn">Редагувати</button>
          <button onclick="deleteRoom(${room.RoomID})" class="delete-btn">Видалити</button>
        </td>
      `;

      tableBody.appendChild(row);
    });

  } catch (error) {
    console.error('Помилка завантаження кімнат:', error);
  }
}

// Відкрити форму для додавання нової кімнати
function openAddForm() {
  document.getElementById('form-title').textContent = 'Додати кімнату';
  document.getElementById('roomId').value = '';
  document.getElementById('number').value = '';
  document.getElementById('type').value = '';
  document.getElementById('price').value = '';
  document.getElementById('room-form').classList.remove('hidden');

  document.getElementById('room-form').scrollIntoView({ behavior: 'smooth' });
}

// Відкрити форму для редагування кімнати
function editRoom(id, capacity, comfort, price) {
  document.getElementById('form-title').textContent = 'Редагувати кімнату';
  document.getElementById('roomId').value = id;
  document.getElementById('number').value = capacity;
  document.getElementById('type').value = comfort.toLowerCase();
  document.getElementById('price').value = price;
  document.getElementById('room-form').classList.remove('hidden');

  document.getElementById('room-form').scrollIntoView({ behavior: 'smooth' });
}

// Закрити форму
function closeForm() {
  document.getElementById('room-form').classList.add('hidden');
  document.getElementById('roomId').value = '';
  document.getElementById('number').value = '';
  document.getElementById('type').value = '';
  document.getElementById('price').value = '';
}

// Зберегти кімнату
async function saveRoom() {
  const id = document.getElementById('roomId').value;
  const capacity = document.getElementById('number').value;
  const comfort = document.getElementById('type').value;
  const price = document.getElementById('price').value;

  const roomData = {
    capacity: parseInt(capacity),
    comfort,
    price: parseFloat(price)
  };

  try {
    let res;
    if (id) {
      res = await fetch(`${apiUrl}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(roomData)
      });
    } else {
      res = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(roomData)
      });
    }

    if (!res.ok) throw new Error('Не вдалося зберегти кімнату');
    closeForm();
    loadRooms();
  } catch (error) {
    console.error('Помилка збереження кімнати:', error);
  }
}

// Видалити кімнату
async function deleteRoom(id) {
  if (!confirm('Ви впевнені, що хочете видалити цю кімнату?')) return;

  try {
    const res = await fetch(`${apiUrl}/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Не вдалося видалити кімнату');
    loadRooms();
  } catch (error) {
    console.error('Помилка видалення кімнати:', error);
  }
}
