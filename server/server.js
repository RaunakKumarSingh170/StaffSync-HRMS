const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const User = require('./models/user');
const Leave = require('./models/leave');
const Announcement = require('./models/announcement');
const Attendance = require('./models/Attendance');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;
const JWT_SECRET = process.env.JWT_SECRET || 'staffsync_dev_secret_key_123';

// Utility: format today's date YYYY-MM-DD
const getTodayDateStr = () => {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// Utility: calculate days between dates inclusive
const calculateDays = (startDate, endDate) => {
  const s = new Date(startDate);
  const e = new Date(endDate);
  const diffTime = Math.abs(e - s);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
  return Math.max(1, isNaN(diffDays) ? 1 : diffDays);
};

// ----------------- AUTH ROUTES ----------------- //

// Register
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password, role, department, position, salary } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'Email already exists' });

    const hashedPassword = await bcrypt.hash(password || 'password123', 10);
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role || 'Employee',
      department: department || 'General',
      position: position || 'Staff',
      salary: salary ? Number(salary) : 50000,
    });

    const token = jwt.sign({ id: user._id, role: user.role, name: user.name }, JWT_SECRET, {
      expiresIn: '7d',
    });

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: user._id,
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department,
        position: user.position,
        salary: user.salary,
        status: user.status,
      },
    });
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
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department,
        position: user.position,
        salary: user.salary,
        status: user.status || 'Active',
        leaveQuota: user.leaveQuota || { casual: 12, sick: 10, earned: 15 },
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ----------------- EMPLOYEE ROUTES ----------------- //

// Get all employees (with optional search and department filter)
app.get('/api/employees', async (req, res) => {
  try {
    const { search, department } = req.query;
    let query = {};

    if (search && search.trim() !== '') {
      query.$or = [
        { name: { $regex: search.trim(), $options: 'i' } },
        { email: { $regex: search.trim(), $options: 'i' } },
        { position: { $regex: search.trim(), $options: 'i' } },
      ];
    }

    if (department && department !== 'All') {
      query.department = department;
    }

    const employees = await User.find(query).select('-password').sort({ createdAt: -1 });
    res.json(employees);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add new employee (Admin)
app.post('/api/employees', async (req, res) => {
  try {
    const { name, email, password, role, department, position, salary } = req.body;
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: 'An employee with this email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password || 'password123', 10);
    const newEmployee = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role || 'Employee',
      department: department || 'Engineering',
      position: position || 'Team Member',
      salary: salary ? Number(salary) : 60000,
      status: 'Active',
      leaveQuota: { casual: 12, sick: 10, earned: 15 },
    });

    const returnedUser = newEmployee.toObject();
    delete returnedUser.password;
    res.status(201).json(returnedUser);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update employee
app.patch('/api/employees/:id', async (req, res) => {
  try {
    const { name, department, position, salary, status, role } = req.body;
    const updated = await User.findByIdAndUpdate(
      req.params.id,
      { name, department, position, salary, status, role },
      { new: true }
    ).select('-password');
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete an employee
app.delete('/api/employees/:id', async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    await Leave.deleteMany({ employee: req.params.id });
    await Attendance.deleteMany({ employee: req.params.id });
    res.json({ message: 'Employee removed successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ----------------- ATTENDANCE ROUTES ----------------- //

// Clock in
app.post('/api/attendance/clock-in', async (req, res) => {
  try {
    const { employeeId } = req.body;
    if (!employeeId) return res.status(400).json({ message: 'Employee ID is required' });

    const today = getTodayDateStr();
    const existing = await Attendance.findOne({ employee: employeeId, date: today });
    if (existing) {
      return res.status(400).json({
        message: 'Already clocked in for today',
        attendance: existing,
      });
    }

    const now = new Date();
    // Rule: if check in after 9:30 AM local time, mark as Late, otherwise Present
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const isLate = hours > 9 || (hours === 9 && minutes > 30);
    const status = isLate ? 'Late' : 'Present';

    const attendance = await Attendance.create({
      employee: employeeId,
      date: today,
      checkIn: now,
      status,
    });

    const populated = await Attendance.findById(attendance._id).populate('employee', 'name email department');
    res.status(201).json(populated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Clock out
app.post('/api/attendance/clock-out', async (req, res) => {
  try {
    const { employeeId } = req.body;
    if (!employeeId) return res.status(400).json({ message: 'Employee ID is required' });

    const today = getTodayDateStr();
    const attendance = await Attendance.findOne({ employee: employeeId, date: today });
    if (!attendance) {
      return res.status(400).json({ message: 'No active clock-in session found for today' });
    }

    if (attendance.checkOut) {
      return res.status(400).json({
        message: 'Already clocked out for today',
        attendance,
      });
    }

    const checkOutTime = new Date();
    const durationMs = checkOutTime - new Date(attendance.checkIn);
    const workHours = Math.round((durationMs / (1000 * 60 * 60)) * 10) / 10;

    attendance.checkOut = checkOutTime;
    attendance.workHours = workHours;
    if (workHours < 4 && attendance.status !== 'Late') {
      attendance.status = 'Half-day';
    }

    await attendance.save();
    const populated = await Attendance.findById(attendance._id).populate('employee', 'name email department');
    res.json(populated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Today's attendance status for an employee
app.get('/api/attendance/today', async (req, res) => {
  try {
    const { employeeId } = req.query;
    if (!employeeId) return res.status(400).json({ message: 'Employee ID is required' });

    const today = getTodayDateStr();
    const attendance = await Attendance.findOne({ employee: employeeId, date: today }).populate(
      'employee',
      'name email department'
    );

    res.json({
      clockedIn: !!attendance,
      clockedOut: !!(attendance && attendance.checkOut),
      attendance: attendance || null,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/attendance/today/:employeeId', async (req, res) => {
  try {
    const { employeeId } = req.params;
    const today = getTodayDateStr();
    const attendance = await Attendance.findOne({ employee: employeeId, date: today }).populate(
      'employee',
      'name email department'
    );

    res.json({
      clockedIn: !!attendance,
      clockedOut: !!(attendance && attendance.checkOut),
      attendance: attendance || null,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get attendance logs
app.get('/api/attendance', async (req, res) => {
  try {
    const { employeeId, date } = req.query;
    let query = {};
    if (employeeId) query.employee = employeeId;
    if (date) query.date = date;

    const logs = await Attendance.find(query)
      .populate('employee', 'name email department position')
      .sort({ createdAt: -1 })
      .limit(100);

    res.json(logs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ----------------- LEAVE ROUTES ----------------- //

// Apply for leave
app.post('/api/leaves', async (req, res) => {
  try {
    const { employeeId, type, startDate, endDate, reason } = req.body;
    if (!employeeId || !startDate || !endDate || !reason) {
      return res.status(400).json({ message: 'All leave fields are required' });
    }

    const leave = await Leave.create({
      employee: employeeId,
      type: type || 'Casual',
      startDate,
      endDate,
      reason,
      status: 'Pending',
    });

    const populated = await Leave.findById(leave._id).populate('employee', 'name email department');
    res.status(201).json(populated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all leaves (with optional employee filter)
app.get('/api/leaves', async (req, res) => {
  try {
    const { employeeId, status } = req.query;
    let query = {};
    if (employeeId) query.employee = employeeId;
    if (status && status !== 'All') query.status = status;

    const leaves = await Leave.find(query)
      .populate('employee', 'name email department position')
      .sort({ createdAt: -1 });

    res.json(leaves);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update leave status (Approve / Reject)
app.patch('/api/leaves/:id', async (req, res) => {
  try {
    const { status } = req.body;
    if (!['Approved', 'Rejected', 'Pending'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const updated = await Leave.findByIdAndUpdate(req.params.id, { status }, { new: true }).populate(
      'employee',
      'name email department position'
    );
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get leave balances for an employee
app.get('/api/leaves/balance/:employeeId', async (req, res) => {
  try {
    const { employeeId } = req.params;
    const user = await User.findById(employeeId);
    if (!user) return res.status(404).json({ message: 'Employee not found' });

    const quota = user.leaveQuota || { casual: 12, sick: 10, earned: 15 };

    // Fetch approved leaves for this employee
    const approvedLeaves = await Leave.find({ employee: employeeId, status: 'Approved' });
    const pendingLeaves = await Leave.find({ employee: employeeId, status: 'Pending' });

    const used = { Casual: 0, Sick: 0, Earned: 0 };
    const pending = { Casual: 0, Sick: 0, Earned: 0 };

    approvedLeaves.forEach((l) => {
      const days = calculateDays(l.startDate, l.endDate);
      if (used[l.type] !== undefined) {
        used[l.type] += days;
      }
    });

    pendingLeaves.forEach((l) => {
      const days = calculateDays(l.startDate, l.endDate);
      if (pending[l.type] !== undefined) {
        pending[l.type] += days;
      }
    });

    const balance = {
      casual: {
        total: quota.casual,
        used: used.Casual,
        pending: pending.Casual,
        remaining: Math.max(0, quota.casual - used.Casual),
      },
      sick: {
        total: quota.sick,
        used: used.Sick,
        pending: pending.Sick,
        remaining: Math.max(0, quota.sick - used.Sick),
      },
      earned: {
        total: quota.earned,
        used: used.Earned,
        pending: pending.Earned,
        remaining: Math.max(0, quota.earned - used.Earned),
      },
    };

    res.json(balance);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ----------------- ANNOUNCEMENT ROUTES ----------------- //

// Post announcement
app.post('/api/announcements', async (req, res) => {
  try {
    const { title, content, author } = req.body;
    if (!title || !content) {
      return res.status(400).json({ message: 'Title and content are required' });
    }
    const post = await Announcement.create({
      title,
      content,
      author: author || 'HR Operations',
    });
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

// Delete announcement
app.delete('/api/announcements/:id', async (req, res) => {
  try {
    await Announcement.findByIdAndDelete(req.params.id);
    res.json({ message: 'Announcement deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ----------------- ANALYTICS & DASHBOARD ROUTE ----------------- //

app.get('/api/analytics/dashboard', async (req, res) => {
  try {
    const employees = await User.find();
    const leaves = await Leave.find();
    const today = getTodayDateStr();
    const todayAttendance = await Attendance.find({ date: today });

    // Department Distribution
    const deptMap = {};
    employees.forEach((emp) => {
      const dept = emp.department || 'General';
      deptMap[dept] = (deptMap[dept] || 0) + 1;
    });

    const departmentDistribution = Object.keys(deptMap).map((dept) => ({
      name: dept,
      count: deptMap[dept],
    }));

    // Monthly Leave Trends (Last 6 months)
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthlyLeavesMap = {};

    // Initialize 6 months up to current
    const currentMonth = new Date().getMonth();
    for (let i = 5; i >= 0; i--) {
      const mIdx = (currentMonth - i + 12) % 12;
      monthlyLeavesMap[monthNames[mIdx]] = 0;
    }

    leaves.forEach((l) => {
      const date = new Date(l.startDate || l.createdAt);
      const m = monthNames[date.getMonth()];
      if (monthlyLeavesMap[m] !== undefined) {
        monthlyLeavesMap[m] += 1;
      }
    });

    const leaveTrends = Object.keys(monthlyLeavesMap).map((m) => ({
      month: m,
      applications: monthlyLeavesMap[m],
    }));

    // Leave status breakdown
    const pendingLeaves = leaves.filter((l) => l.status === 'Pending').length;
    const approvedLeaves = leaves.filter((l) => l.status === 'Approved').length;
    const rejectedLeaves = leaves.filter((l) => l.status === 'Rejected').length;

    // Active today count
    const presentCount = todayAttendance.length;
    const workforceCount = employees.length;
    const attendanceRate = workforceCount > 0 ? Math.round((presentCount / workforceCount) * 100) : 0;

    res.json({
      totalEmployees: workforceCount,
      pendingLeaves,
      approvedLeaves,
      rejectedLeaves,
      activeToday: presentCount,
      attendanceRate,
      departmentDistribution,
      leaveTrends,
    });
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
