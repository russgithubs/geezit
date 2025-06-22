// server.js - GeeziT Backend API
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Pool } = require('pg');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Neon Database connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

// JWT Secret
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Database initialization
async function initDB() {
  try {
    // Users table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        email VARCHAR(100),
        password_hash VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Messages table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS messages (
        id SERIAL PRIMARY KEY,
        to_user_id INTEGER REFERENCES users(id),
        message_text TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Hearts table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS hearts (
        id SERIAL PRIMARY KEY,
        from_user_id INTEGER REFERENCES users(id),
        to_user_id INTEGER REFERENCES users(id),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(from_user_id, to_user_id)
      )
    `);

    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Database initialization error:', error);
  }
}

// Initialize database on startup
initDB();

// Middleware to verify JWT token
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.sendStatus(401);
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

// Routes

// Sign up
app.post('/api/auth/signup', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Validate input
    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password required' });
    }

    if (username.length < 3) {
      return res.status(400).json({ error: 'Username must be at least 3 characters' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    // Check if username exists
    const existingUser = await pool.query(
      'SELECT id FROM users WHERE username = $1',
      [username]
    );

    if (existingUser.rows.length > 0) {
      return res.status(400).json({ error: 'Username already taken' });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create user
    const result = await pool.query(
      'INSERT INTO users (username, password_hash) VALUES ($1, $2) RETURNING id, username',
      [username, passwordHash]
    );

    const user = result.rows[0];

    // Generate JWT
    const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET);

    res.json({
      token,
      user: {
        id: user.id,
        username: user.username
      }
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Get user
    const result = await pool.query(
      'SELECT id, username, password_hash FROM users WHERE username = $1',
      [username]
    );

    if (result.rows.length === 0) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const user = result.rows[0];

    // Verify password
    const validPassword = await bcrypt.compare(password, user.password_hash);
    if (!validPassword) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // Generate JWT
    const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET);

    res.json({
      token,
      user: {
        id: user.id,
        username: user.username
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get user profile
app.get('/api/user/profile', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, username, email, created_at FROM users WHERE id = $1',
      [req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const user = result.rows[0];

    // Get message count
    const messageCount = await pool.query(
      'SELECT COUNT(*) FROM messages WHERE to_user_id = $1',
      [req.user.id]
    );

    // Get heart count
    const heartCount = await pool.query(
      'SELECT COUNT(*) FROM hearts WHERE to_user_id = $1',
      [req.user.id]
    );

    res.json({
      ...user,
      message_count: parseInt(messageCount.rows[0].count),
      heart_count: parseInt(heartCount.rows[0].count)
    });
  } catch (error) {
    console.error('Profile error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update user profile
app.put('/api/user/profile', authenticateToken, async (req, res) => {
  try {
    const { username, email } = req.body;
    const updates = [];
    const values = [];
    let paramCount = 1;

    if (username) {
      // Check if new username is taken
      const existing = await pool.query(
        'SELECT id FROM users WHERE username = $1 AND id != $2',
        [username, req.user.id]
      );

      if (existing.rows.length > 0) {
        return res.status(400).json({ error: 'Username already taken' });
      }

      updates.push(`username = $${paramCount}`);
      values.push(username);
      paramCount++;
    }

    if (email) {
      updates.push(`email = $${paramCount}`);
      values.push(email);
      paramCount++;
    }

    if (updates.length === 0) {
      return res.status(400).json({ error: 'No updates provided' });
    }

    updates.push(`updated_at = CURRENT_TIMESTAMP`);
    values.push(req.user.id);

    const query = `
      UPDATE users 
      SET ${updates.join(', ')} 
      WHERE id = $${paramCount} 
      RETURNING id, username, email
    `;

    const result = await pool.query(query, values);

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Send message
app.post('/api/messages', async (req, res) => {
  try {
    const { username, message } = req.body;

    if (!username || !message) {
      return res.status(400).json({ error: 'Username and message required' });
    }

    // Get recipient user
    const userResult = await pool.query(
      'SELECT id FROM users WHERE username = $1',
      [username]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const toUserId = userResult.rows[0].id;

    // Insert message
    await pool.query(
      'INSERT INTO messages (to_user_id, message_text) VALUES ($1, $2)',
      [toUserId, message]
    );

    res.json({ success: true });
  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get messages
app.get('/api/messages', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, message_text, created_at FROM messages WHERE to_user_id = $1 ORDER BY created_at DESC',
      [req.user.id]
    );

    res.json(result.rows);
  } catch (error) {
    console.error('Get messages error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Send heart
app.post('/api/hearts', authenticateToken, async (req, res) => {
  try {
    const { username } = req.body;

    // Get recipient user
    const userResult = await pool.query(
      'SELECT id FROM users WHERE username = $1',
      [username]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const toUserId = userResult.rows[0].id;

    // Check if heart already exists
    const existing = await pool.query(
      'SELECT id FROM hearts WHERE from_user_id = $1 AND to_user_id = $2',
      [req.user.id, toUserId]
    );

    if (existing.rows.length > 0) {
      // Remove heart
      await pool.query(
        'DELETE FROM hearts WHERE from_user_id = $1 AND to_user_id = $2',
        [req.user.id, toUserId]
      );
      res.json({ hearted: false });
    } else {
      // Add heart
      await pool.query(
        'INSERT INTO hearts (from_user_id, to_user_id) VALUES ($1, $2)',
        [req.user.id, toUserId]
      );
      res.json({ hearted: true });
    }
  } catch (error) {
    console.error('Heart error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get hearts/activity
app.get('/api/hearts', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT created_at FROM hearts WHERE to_user_id = $1 ORDER BY created_at DESC',
      [req.user.id]
    );

    res.json(result.rows);
  } catch (error) {
    console.error('Get hearts error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Check if user exists
app.get('/api/users/:username', async (req, res) => {
  try {
    const { username } = req.params;
    
    const result = await pool.query(
      'SELECT username FROM users WHERE username = $1',
      [username]
    );

    res.json({ exists: result.rows.length > 0 });
  } catch (error) {
    console.error('Check user error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});