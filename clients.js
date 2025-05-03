const apiUrl = 'http://localhost:3000/clients';

document.addEventListener('DOMContentLoaded', loadClients);

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

function openAddForm() {
  document.getElementById('form-title').textContent = 'Додати клієнта';
  document.getElementById('clientId').value = '';
  document.getElementById('fullName').value = '';
  document.getElementById('phone').value = '';
  document.getElementById('passport').value = '';
  document.getElementById('client-form').classList.remove('hidden');

  document.getElementById('client-form').scrollIntoView({ behavior: 'smooth' });
}

function editClient(id, fullName, phone, passport) {
  document.getElementById('form-title').textContent = 'Редагувати клієнта';
  document.getElementById('clientId').value = id;
  document.getElementById('fullName').value = fullName;
  document.getElementById('phone').value = phone;
  document.getElementById('passport').value = passport;
  document.getElementById('client-form').classList.remove('hidden');

  document.getElementById('client-form').scrollIntoView({ behavior: 'smooth' });
}

function closeForm() {
  document.getElementById('client-form').classList.add('hidden');
  document.getElementById('fullName').value = '';
  document.getElementById('phone').value = '';
  document.getElementById('passport').value = '';
  document.getElementById('clientId').value = ''; 
}


document.getElementById('clientForm').addEventListener('submit', async function(e) {
  e.preventDefault();
  const id = document.getElementById('clientId').value;
  const fullName = document.getElementById('fullName').value;
  const phone = document.getElementById('phone').value;
  const passport = document.getElementById('passport').value;

  try {
    if (id) {
      await fetch(`${apiUrl}/${id}`, {
        method: 'PUT',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ fullName, phone, passport })
      });
    } else {
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

async function deleteClient(id) {
  if (confirm("Ви дійсно хочете видалити цього клієнта? При видаленні клієнта також видаляться всі пов'язані з ним бронювання та рахунки.")) {
    try {
      await fetch(`${apiUrl}/${id}`, { method: 'DELETE' });
      loadClients();
    } catch (error) {
      console.error('Помилка видалення клієнта:', error);
    }
  }
}
