const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('./models/User');
const Leave = require('./models/Leave');
const Announcement = require('./models/Announcement');

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('🌱 Connected to MongoDB for seeding...');

    // Clear old data to avoid duplicates
    await User.deleteMany({});
    await Leave.deleteMany({});
    await Announcement.deleteMany({});

    // Hash a common demo password: password123
    const hashedPassword = await bcrypt.hash('password123', 10);

    // 1. Create Users
    const users = await User.insertMany([
      {
        name: 'Sarah Connor',
        email: 'admin@staffsync.com',
        password: hashedPassword,
        role: 'Admin',
        department: 'Human Resources',
        position: 'HR Director',
        salary: 85000,
      },
      {
        name: 'Alex Rivera',
        email: 'alex@staffsync.com',
        password: hashedPassword,
        role: 'Employee',
        department: 'Engineering',
        position: 'Full Stack Engineer',
        salary: 72000,
      },
      {
        name: 'Priya Sharma',
        email: 'priya@staffsync.com',
        password: hashedPassword,
        role: 'Employee',
        department: 'Design',
        position: 'UI/UX Designer',
        salary: 65000,
      },
      {
        name: 'Marcus Vance',
        email: 'marcus@staffsync.com',
        password: hashedPassword,
        role: 'Employee',
        department: 'Marketing',
        position: 'Growth Lead',
        salary: 60000,
      },
      {
        name: 'Elena Rostova',
        email: 'elena@staffsync.com',
        password: hashedPassword,
        role: 'Employee',
        department: 'Engineering',
        position: 'DevOps Specialist',
        salary: 78000,
      },
    ]);

    console.log('✅ Users created!');

    // 2. Create Leave Requests linked to the employees
    await Leave.insertMany([
      {
        employee: users[1]._id, // Alex
        type: 'Casual',
        startDate: new Date('2026-11-01'),
        endDate: new Date('2026-11-04'),
        reason: 'Family wedding event out of town.',
        status: 'Pending',
      },
      {
        employee: users[2]._id, // Priya
        type: 'Sick',
        startDate: new Date('2026-10-25'),
        endDate: new Date('2026-10-26'),
        reason: 'Recovering from seasonal flu.',
        status: 'Approved',
      },
      {
        employee: users[3]._id, // Marcus
        type: 'Earned',
        startDate: new Date('2026-12-20'),
        endDate: new Date('2026-12-28'),
        reason: 'Year-end holiday travel.',
        status: 'Pending',
      },
    ]);

    console.log('✅ Sample leaves created!');

    // 3. Create Company Announcements
    await Announcement.insertMany([
      {
        title: 'Q4 All-Hands Meeting & Strategy Session',
        content:
          'Please join us this Friday at 4 PM for the quarterly retrospective and roadmap preview.',
        author: 'Sarah Connor (HR)',
      },
      {
        title: 'Updated Remote Work & Leave Guidelines',
        content:
          'Our updated leave policy has been published. All leave requests must be submitted at least 48 hours in advance.',
        author: 'HR Operations',
      },
    ]);

    console.log('✅ Announcements published!');
    console.log('\n🎉 Database successfully seeded with demo data!');
    console.log('Demo Login credentials:');
    console.log('👉 Admin:    admin@staffsync.com / password123');
    console.log('👉 Employee: alex@staffsync.com  / password123');

    process.exit(0);
  } catch (err) {
    console.error('❌ Seeding error:', err.message);
    process.exit(1);
  }
};

seedDB();