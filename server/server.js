const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const User = require('./models/User');
const Leave = require('./models/Leave');
const Announcement = require('./models/Announcement');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;
const JWT_SECRET = process.env.JWT_SECRET || 'staffsync_dev_secret_key_123';

// ----------------- AUTH ROUTES ----------------- //

// Register
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password, role, department, position, salary } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'Email already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role || 'Employee',
      department,
      position,
      salary,
    });

    res.status(201).json({ message: 'User registered successfully', userId: user._id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id, role: user.role, name: user.name }, JWT_SECRET, {
      expiresIn: '7d',
    });

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department,
        position: user.position,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ----------------- EMPLOYEE ROUTES ----------------- //

// Get all employees
app.get('/api/employees', async (req, res) => {
  try {
    const employees = await User.find().select('-password');
    res.json(employees);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete an employee
app.delete('/api/employees/:id', async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'Employee removed successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ----------------- LEAVE ROUTES ----------------- //

// Apply for leave
app.post('/api/leaves', async (req, res) => {
  try {
    const { employeeId, type, startDate, endDate, reason } = req.body;
    const leave = await Leave.create({
      employee: employeeId,
      type,
      startDate,
      endDate,
      reason,
    });
    res.status(201).json(leave);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all leaves (with employee info populated)
app.get('/api/leaves', async (req, res) => {
  try {
    const leaves = await Leave.find().populate('employee', 'name email department');
    res.json(leaves);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update leave status (Approve / Reject)
app.patch('/api/leaves/:id', async (req, res) => {
  try {
    const { status } = req.body;
    const updated = await Leave.findByIdAndUpdate(req.params.id, { status }, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ----------------- ANNOUNCEMENT ROUTES ----------------- //

// Post announcement
app.post('/api/announcements', async (req, res) => {
  try {
    const { title, content, author } = req.body;
    const post = await Announcement.create({ title, content, author });
    res.status(201).json(post);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get announcements
app.get('/api/announcements', async (req, res) => {
  try {
    const posts = await Announcement.find().sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ----------------- DATABASE & SERVER START ----------------- //
mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB connected successfully!');
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err.message);
  });