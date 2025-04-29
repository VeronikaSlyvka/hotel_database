const apiUrl = 'http://localhost:3000/clients';

// Завантажити клієнтів при завантаженні сторінки
document.addEventListener('DOMContentLoaded', loadClients);

// Завантаження списку клієнтів
async function loadClients() {
  try {
    const res = await fetch(apiUrl);
    const clients = await res.json();
    const tableBody = document.getElementById('clients-table-body');
    tableBody.innerHTML = '';

    clients.forEach(client => {
      const row = document.createElement('tr');

      row.innerHTML = `
        <td>${client.ClientID}</td>
        <td>${client.FullName}</td>
        <td>${client.Phone}</td>
        <td>${client.Passport}</td>
        <td>
          <button onclick="editClient(${client.ClientID}, '${client.FullName}', '${client.Phone}', '${client.Passport}')" class="edit-btn">Редагувати</button>
          <button onclick="deleteClient(${client.ClientID})" class="delete-btn">Видалити</button>
        </td>
      `;

      tableBody.appendChild(row);
    });

  } catch (error) {
    console.error('Помилка завантаження клієнтів:', error);
  }
}

// Відкрити форму для додавання нового клієнта
function openAddForm() {
  document.getElementById('form-title').textContent = 'Додати клієнта';
  document.getElementById('clientId').value = '';
  document.getElementById('fullName').value = '';
  document.getElementById('phone').value = '';
  document.getElementById('passport').value = '';
  document.getElementById('client-form').classList.remove('hidden');

  // Прокрутка сторінки до форми
  document.getElementById('client-form').scrollIntoView({ behavior: 'smooth' });
}

// Відкрити форму для редагування клієнта
function editClient(id, fullName, phone, passport) {
  document.getElementById('form-title').textContent = 'Редагувати клієнта';
  document.getElementById('clientId').value = id;
  document.getElementById('fullName').value = fullName;
  document.getElementById('phone').value = phone;
  document.getElementById('passport').value = passport;
  document.getElementById('client-form').classList.remove('hidden');

  // Прокрутка сторінки до форми
  document.getElementById('client-form').scrollIntoView({ behavior: 'smooth' });
}

// Закрити форму та очистити поля
function closeForm() {
  document.getElementById('client-form').classList.add('hidden');
  // Очищаємо поля форми
  document.getElementById('fullName').value = '';
  document.getElementById('phone').value = '';
  document.getElementById('passport').value = '';
  document.getElementById('clientId').value = ''; // очищаємо і прихований input (ID)
}


// Зберегти клієнта
document.getElementById('clientForm').addEventListener('submit', async function(e) {
  e.preventDefault();
  const id = document.getElementById('clientId').value;
  const fullName = document.getElementById('fullName').value;
  const phone = document.getElementById('phone').value;
  const passport = document.getElementById('passport').value;

  try {
    if (id) {
      // Оновити існуючого клієнта
      await fetch(`${apiUrl}/${id}`, {
        method: 'PUT',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ fullName, phone, passport })
      });
    } else {
      // Додати нового клієнта
      await fetch(apiUrl, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ fullName, phone, passport })
      });
    }
    closeForm();
    loadClients();
  } catch (error) {
    console.error('Помилка збереження клієнта:', error);
  }
});

// Видалити клієнта
async function deleteClient(id) {
  if (confirm('Ви дійсно хочете видалити цього клієнта?')) {
    try {
      await fetch(`${apiUrl}/${id}`, { method: 'DELETE' });
      loadClients();
    } catch (error) {
      console.error('Помилка видалення клієнта:', error);
    }
  }
}
