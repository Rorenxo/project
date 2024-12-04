const express = require('express');
const mysql = require('mysql2');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const bodyParser = require('body-parser');

// Initialize the app and middleware
const app = express();
const port = 4000;

app.use(cors());
app.use(bodyParser.json());

// Connect to MySQL
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root', 
  password: '', 
  database: 'foodie_finder'
});

db.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err);
    process.exit(1);
  }
  console.log('Connected to MySQL');
});

// Register endpoint
app.post('/register', async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  // Check if the username or email is already taken
  db.query('SELECT * FROM users WHERE username = ? OR email = ?', [username, email], async (err, results) => {
    if (err) return res.status(500).json({ message: 'Database error' });

    if (results.length > 0) {
      return res.status(400).json({ message: 'Username or Email already taken' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert new user into the database
    db.query('INSERT INTO users (username, email, password) VALUES (?, ?, ?)', [username, email, hashedPassword], (err, results) => {
      if (err) return res.status(500).json({ message: 'Database error' });
      res.status(200).json({ message: 'User registered successfully' });
    });
  });
});

// Login endpoint
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Username and Password are required' });
  }

  // Check if user exists
  db.query('SELECT * FROM users WHERE username = ?', [username], async (err, results) => {
    if (err) return res.status(500).json({ message: 'Database error' });

    if (results.length === 0) {
      return res.status(400).json({ message: 'Invalid username or password' });
    }

    const user = results[0];

    // Compare password
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(400).json({ message: 'Invalid username or password' });
    }

    // Generate a JWT token
    const token = jwt.sign({ userId: user.id, username: user.username }, 'your_jwt_secret', { expiresIn: '1h' });

    res.status(200).json({ message: 'Login successful', token });
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
//orders
app.post('/api/orders', (req, res) => {
  const { items, totalPrice, discountedTotal, paymentMethod } = req.body;

  if (!items || !totalPrice || !paymentMethod) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const finalTotal = discountedTotal || totalPrice; // Use discounted total if provided

  const orderQuery = `
    INSERT INTO orders (items, total_price, discounted_total, payment_method, created_at) 
    VALUES (?, ?, ?, ?, NOW())
  `;

  db.query(
    orderQuery,
    [JSON.stringify(items), totalPrice, finalTotal, paymentMethod],
    (err, result) => {
      if (err) {
        console.error('Error saving order:', err);
        return res.status(500).json({ error: 'Failed to save order' });
      }
      res.status(201).json({ message: 'Order saved successfully', orderId: result.insertId });
    }
  );
});


