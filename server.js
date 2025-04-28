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
  res.send('Hello, Hotel Database!');
});

// Test database connection
// app.get('/test-connection', async (req, res) => {
//     try {
//       // Try to connect to the database
//       await mssql.connect(sqlConfig);
  
//       // If successful, send success message
//       res.send('Database connection successful!');
//     } catch (err) {
//       // If connection fails, send error message
//       console.error('Database connection error:', err);
//       res.status(500).send('Database connection failed');
//     } finally {
//       // Close the connection
//       await mssql.close();
//     }
//   });
  

app.get('/rooms', async (req, res) => {
    try {
      console.log('Connecting to the database...');
      let pool = await mssql.connect(sqlConfig);
      console.log('Connected successfully');
      let result = await pool.request().query('SELECT *  FROM HotelDB.dbo.Rooms');
      res.json(result.recordset);
    } catch (error) {
      console.error('Error connecting to the database:', error);
      res.status(500).send('Server error');
    }
  });
  

// app.get('/t', async (req, res) => {
//     try {
//       let pool = await mssql.connect(sqlConfig);  // Підключення до бази даних
//       res.send('Connected to SQL Server');  // Якщо підключення успішне
//     } catch (error) {
//       console.error('Error:', error);  // Якщо сталася помилка
//       res.status(500).send('Database connection error');
//     }
//   });
  
  

const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});