const express = require('express');
const jwt = require('jsonwebtoken');
const cors = require('cors');
var cookieParser = require('cookie-parser')



const app = express();
app.use(cors({ credentials: true, origin: '*' }));

app.use(cookieParser())
app.use((req, res, next) => {
  const allowedOrigins = ['http://localhost:5173']; // Add your frontend origin here
  const origin = req.headers.origin;

  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }

  res.header('Access-Control-Allow-Credentials', true);
  next();
});

// Secret key for JWT signing
const secretKey = 'your-secret-key';

// Endpoint for user login
app.get('/', (req, res) => {	
    res.send('Hello World ----1');
    });
app.post('/login', (req, res) => {
  // For demonstration, assume the user is authenticated and retrieve their user ID
  const userId = 'user123';

  // Create JWT token
  const token = jwt.sign({ userId }, secretKey, { expiresIn: '1h' });

  // Set JWT as HTTP-only cookie
  res.cookie('jwt', token, { httpOnly: true, sameSite: 'none', secure: true });

  res.json({ success: true });
});

// Protected route - requires authentication
app.get('/protected', (req, res) => {
  // Check if JWT cookie is present
  const token = req.cookies.jwt;

  if (!token) {
    return res.status(400).json({ error: 'Unauthorized ' });
  }

  // Verify JWT token
  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // If JWT is valid, proceed with the request
    res.json({ userId: decoded.userId });
  });
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
