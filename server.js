const express = require('express');
const cors = require('cors');
const mssql = require('mssql');

const app = express();
app.use(cors());
app.use(express.json());

const sqlConfig = {
  user: 'user',
  password: '250836',
  database: 'HotelDB',
  server: '127.0.0.1\\SQLEXPRESS',
  options: {
    encrypt: false,
    trustServerCertificate: true,
    trustedConnection: true
  } 
};

app.get('/', (req, res) => {
  res.send('Hotel Database');
});

// ======================= ROOMS =======================

app.get('/rooms', async (req, res) => {
  try {
    let pool = await mssql.connect(sqlConfig);
    let result = await pool.request().query('SELECT * FROM HotelDB.dbo.Rooms');
    res.json(result.recordset);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
});

app.post('/rooms', async (req, res) => {
  try {
    const { capacity, comfort, price } = req.body;
    let pool = await mssql.connect(sqlConfig);
    await pool.request()
      .input('capacity', mssql.Int, capacity)
      .input('comfort', mssql.VarChar(50), comfort)
      .input('price', mssql.Decimal(10, 2), price)
      .query('INSERT INTO HotelDB.dbo.Rooms (Capacity, Comfort, Price) VALUES (@capacity, @comfort, @price)');
    res.send('Room created');
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
});

app.put('/rooms/:id', async (req, res) => {
  try {
    const { capacity, comfort, price } = req.body;
    const { id } = req.params;
    let pool = await mssql.connect(sqlConfig);
    await pool.request()
      .input('id', mssql.Int, id)
      .input('capacity', mssql.Int, capacity)
      .input('comfort', mssql.VarChar(50), comfort)
      .input('price', mssql.Decimal(10, 2), price)
      .query('UPDATE HotelDB.dbo.Rooms SET Capacity = @capacity, Comfort = @comfort, Price = @price WHERE RoomID = @id');
    res.send('Room updated');
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
});

app.delete('/rooms/:id', async (req, res) => {
  const { id } = req.params;

  try {
    let pool = await mssql.connect(sqlConfig);

    await pool.request()
      .input('roomId', mssql.Int, id)
      .query(`
        DELETE FROM HotelDB.dbo.Invoices 
        WHERE BookingID IN (
          SELECT BookingID FROM HotelDB.dbo.Bookings WHERE RoomID = @roomId
        )
      `);

      await pool.request()
      .input('roomId', mssql.Int, id)
      .query('DELETE FROM HotelDB.dbo.Bookings WHERE RoomID = @roomId');

    await pool.request()
      .input('id', mssql.Int, id)
      .query('DELETE FROM HotelDB.dbo.Rooms WHERE RoomID = @id');

    res.send('Room and related bookings/invoices deleted');
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error during room deletion');
  }
});


// ======================= CLIENTS =======================

app.get('/clients', async (req, res) => {
  try {
    let pool = await mssql.connect(sqlConfig);
    let result = await pool.request().query('SELECT * FROM HotelDB.dbo.Clients');
    res.json(result.recordset);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
});

app.post('/clients', async (req, res) => {
  try {
    const { fullName, phone, passport } = req.body;
    let pool = await mssql.connect(sqlConfig);
    await pool.request()
      .input('fullName', mssql.VarChar(255), fullName)
      .input('phone', mssql.VarChar(50), phone)
      .input('passport', mssql.VarChar(50), passport)
      .query('INSERT INTO HotelDB.dbo.Clients (FullName, Phone, Passport) VALUES (@fullName, @phone, @passport)');
    res.send('Client created');
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
});

app.put('/clients/:id', async (req, res) => {
  try {
    const { fullName, phone, passport } = req.body;
    const { id } = req.params;
    let pool = await mssql.connect(sqlConfig);
    await pool.request()
      .input('id', mssql.Int, id)
      .input('fullName', mssql.VarChar(255), fullName)
      .input('phone', mssql.VarChar(50), phone)
      .input('passport', mssql.VarChar(50), passport)
      .query('UPDATE HotelDB.dbo.Clients SET FullName = @fullName, Phone = @phone, Passport = @passport WHERE ClientID = @id');
    res.send('Client updated');
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
});

app.delete('/clients/:id', async (req, res) => {
  const { id } = req.params;

  try {
    let pool = await mssql.connect(sqlConfig);

    await pool.request()
      .input('clientId', mssql.Int, id)
      .query(`
        DELETE FROM HotelDB.dbo.Invoices 
        WHERE BookingID IN (
          SELECT BookingID FROM HotelDB.dbo.Bookings WHERE ClientID = @clientId
        )
      `);

    await pool.request()
      .input('clientId', mssql.Int, id)
      .query('DELETE FROM HotelDB.dbo.Bookings WHERE ClientID = @clientId');

    await pool.request()
      .input('id', mssql.Int, id)
      .query('DELETE FROM HotelDB.dbo.Clients WHERE ClientID = @id');

    res.send('Client and related records deleted');
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error during client deletion');
  }
});


// ======================= BOOKINGS =======================

app.get('/bookings', async (req, res) => {
  try {
    let pool = await mssql.connect(sqlConfig);
    let result = await pool.request().query('SELECT * FROM HotelDB.dbo.Bookings');
    res.json(result.recordset);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
});

app.post('/bookings', async (req, res) => {
  try {
    const { clientID, roomID, checkIn, checkOut } = req.body;
    let pool = await mssql.connect(sqlConfig);
    await pool.request()
      .input('clientID', mssql.Int, clientID)
      .input('roomID', mssql.Int, roomID)
      .input('checkIn', mssql.Date, checkIn)
      .input('checkOut', mssql.Date, checkOut)
      .query('INSERT INTO HotelDB.dbo.Bookings (ClientID, RoomID, CheckIn, CheckOut) VALUES (@clientID, @roomID, @checkIn, @checkOut)');
    res.send('Booking created');
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
});

app.put('/bookings/:id', async (req, res) => {
  try {
    const { clientID, roomID, checkIn, checkOut } = req.body;
    const { id } = req.params;
    let pool = await mssql.connect(sqlConfig);
    await pool.request()
      .input('id', mssql.Int, id)
      .input('clientID', mssql.Int, clientID)
      .input('roomID', mssql.Int, roomID)
      .input('checkIn', mssql.Date, checkIn)
      .input('checkOut', mssql.Date, checkOut)
      .query('UPDATE HotelDB.dbo.Bookings SET ClientID = @clientID, RoomID = @roomID, CheckIn = @checkIn, CheckOut = @checkOut WHERE BookingID = @id');
    res.send('Booking updated');
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
});

app.delete('/bookings/:id', async (req, res) => {
  const { id } = req.params;

  try {
    let pool = await mssql.connect(sqlConfig);

    await pool.request()
      .input('bookingId', mssql.Int, id)
      .query('DELETE FROM HotelDB.dbo.Invoices WHERE BookingID = @bookingId');

    await pool.request()
      .input('id', mssql.Int, id)
      .query('DELETE FROM HotelDB.dbo.Bookings WHERE BookingID = @id');

    res.send('Booking and related invoices deleted');
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error during booking deletion');
  }
});


// ======================= INVOICES =======================

app.get('/invoices', async (req, res) => {
  try {
    let pool = await mssql.connect(sqlConfig);
    let result = await pool.request().query('SELECT * FROM HotelDB.dbo.Invoices');
    res.json(result.recordset);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
});
;

app.get('/invoices/:id', async (req, res) => {
  try {
    const { id } = req.params;
    let pool = await mssql.connect(sqlConfig);
    let result = await pool.request()
      .input('id', mssql.Int, id)
      .query('SELECT * FROM HotelDB.dbo.Invoices WHERE InvoiceID = @id');
    
    if (result.recordset.length === 0) {
      return res.status(404).send('Invoice not found');
    }

    res.json(result.recordset[0]); 
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
});


app.post('/invoices', async (req, res) => {
  try {
    const { bookingID, amount, paymentStatus, invoiceDate } = req.body;
    let pool = await mssql.connect(sqlConfig);
    await pool.request()
      .input('bookingID', mssql.Int, bookingID)
      .input('amount', mssql.Decimal(10, 2), amount)
      .input('paymentStatus', mssql.VarChar(50), paymentStatus)
      .input('invoiceDate', mssql.Date, invoiceDate)
      .query('INSERT INTO HotelDB.dbo.Invoices (BookingID, Amount, PaymentStatus, InvoiceDate) VALUES (@bookingID, @amount, @paymentStatus, @invoiceDate)');
    res.send('Invoice created');
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
});

app.put('/invoices/:id', async (req, res) => {
  try {
    const { bookingID, amount, paymentStatus, invoiceDate } = req.body;
    const { id } = req.params;
    let pool = await mssql.connect(sqlConfig);
    await pool.request()
      .input('id', mssql.Int, id)
      .input('bookingID', mssql.Int, bookingID)
      .input('amount', mssql.Decimal(10, 2), amount)
      .input('paymentStatus', mssql.VarChar(50), paymentStatus)
      .input('invoiceDate', mssql.Date, invoiceDate)
      .query('UPDATE HotelDB.dbo.Invoices SET BookingID = @bookingID, Amount = @amount, PaymentStatus = @paymentStatus, InvoiceDate = @invoiceDate WHERE InvoiceID = @id');
    res.send('Invoice updated');
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
});

app.delete('/invoices/:id', async (req, res) => {
  try {
    const { id } = req.params;
    let pool = await mssql.connect(sqlConfig);
    await pool.request()
      .input('id', mssql.Int, id)
      .query('DELETE FROM HotelDB.dbo.Invoices WHERE InvoiceID = @id');
    res.send('Invoice deleted');
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
});

const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
