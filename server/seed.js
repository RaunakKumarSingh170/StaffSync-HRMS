const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('./models/user');
const Leave = require('./models/leave');
const Announcement = require('./models/announcement');
const Attendance = require('./models/Attendance');

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('🌱 Connected to MongoDB for seeding...');

    // Clear old data to avoid duplicates
    await User.deleteMany({});
    await Leave.deleteMany({});
    await Announcement.deleteMany({});
    await Attendance.deleteMany({});

    // Hash a common demo password: password123
    const hashedPassword = await bcrypt.hash('password123', 10);

    // 1. Create Users across diverse departments
    const users = await User.insertMany([
      {
        name: 'Sarah Connor',
        email: 'admin@staffsync.com',
        password: hashedPassword,
        role: 'Admin',
        department: 'Human Resources',
        position: 'VP of People & Culture',
        salary: 115000,
        status: 'Active',
        leaveQuota: { casual: 14, sick: 10, earned: 20 },
      },
      {
        name: 'Alex Rivera',
        email: 'alex@staffsync.com',
        password: hashedPassword,
        role: 'Employee',
        department: 'Engineering',
        position: 'Staff Full-Stack Engineer',
        salary: 95000,
        status: 'Active',
        leaveQuota: { casual: 12, sick: 10, earned: 15 },
      },
      {
        name: 'Priya Sharma',
        email: 'priya@staffsync.com',
        password: hashedPassword,
        role: 'Employee',
        department: 'Design',
        position: 'Lead Product Designer',
        salary: 88000,
        status: 'Active',
        leaveQuota: { casual: 12, sick: 10, earned: 15 },
      },
      {
        name: 'Marcus Vance',
        email: 'marcus@staffsync.com',
        password: hashedPassword,
        role: 'Employee',
        department: 'Marketing',
        position: 'Head of Growth Marketing',
        salary: 82000,
        status: 'Active',
        leaveQuota: { casual: 12, sick: 10, earned: 15 },
      },
      {
        name: 'Elena Rostova',
        email: 'elena@staffsync.com',
        password: hashedPassword,
        role: 'Employee',
        department: 'Engineering',
        position: 'Senior DevOps Architect',
        salary: 98000,
        status: 'Active',
        leaveQuota: { casual: 12, sick: 10, earned: 15 },
      },
      {
        name: 'David Chen',
        email: 'david@staffsync.com',
        password: hashedPassword,
        role: 'Employee',
        department: 'Engineering',
        position: 'Frontend Systems Engineer',
        salary: 85000,
        status: 'Active',
        leaveQuota: { casual: 12, sick: 10, earned: 15 },
      },
      {
        name: 'Chloe Dupont',
        email: 'chloe@staffsync.com',
        password: hashedPassword,
        role: 'Employee',
        department: 'Marketing',
        position: 'Senior Brand Strategist',
        salary: 76000,
        status: 'Active',
        leaveQuota: { casual: 12, sick: 10, earned: 15 },
      },
      {
        name: 'Jordan Reed',
        email: 'jordan@staffsync.com',
        password: hashedPassword,
        role: 'Employee',
        department: 'Sales',
        position: 'Enterprise Account Executive',
        salary: 90000,
        status: 'Active',
        leaveQuota: { casual: 12, sick: 10, earned: 15 },
      },
      {
        name: 'Aaliyah Patel',
        email: 'aaliyah@staffsync.com',
        password: hashedPassword,
        role: 'Employee',
        department: 'Customer Success',
        position: 'Customer Success Lead',
        salary: 78000,
        status: 'Active',
        leaveQuota: { casual: 12, sick: 10, earned: 15 },
      },
    ]);

    console.log(`✅ ${users.length} Users created across Engineering, Design, Marketing, Sales, CS, and HR!`);

    // 2. Create Sample Leave Requests linked to the employees
    await Leave.insertMany([
      {
        employee: users[1]._id, // Alex
        type: 'Casual',
        startDate: new Date('2026-11-02'),
        endDate: new Date('2026-11-04'),
        reason: 'Attending annual React & Node infrastructure conference.',
        status: 'Pending',
      },
      {
        employee: users[1]._id, // Alex
        type: 'Sick',
        startDate: new Date('2026-09-14'),
        endDate: new Date('2026-09-15'),
        reason: 'Severe migraine recovery.',
        status: 'Approved',
      },
      {
        employee: users[2]._id, // Priya
        type: 'Casual',
        startDate: new Date('2026-10-18'),
        endDate: new Date('2026-10-20'),
        reason: 'Family reunion and personal commitments.',
        status: 'Approved',
      },
      {
        employee: users[2]._id, // Priya
        type: 'Earned',
        startDate: new Date('2026-12-22'),
        endDate: new Date('2026-12-29'),
        reason: 'Winter family vacation to Kyoto.',
        status: 'Pending',
      },
      {
        employee: users[3]._id, // Marcus
        type: 'Earned',
        startDate: new Date('2026-08-10'),
        endDate: new Date('2026-08-18'),
        reason: 'Summer trek in Patagonia.',
        status: 'Approved',
      },
      {
        employee: users[4]._id, // Elena
        type: 'Sick',
        startDate: new Date('2026-10-05'),
        endDate: new Date('2026-10-06'),
        reason: 'Dental surgery and recovery.',
        status: 'Approved',
      },
      {
        employee: users[5]._id, // David
        type: 'Casual',
        startDate: new Date('2026-11-12'),
        endDate: new Date('2026-11-13'),
        reason: 'Apartment relocation and moving logistics.',
        status: 'Pending',
      },
      {
        employee: users[7]._id, // Jordan
        type: 'Casual',
        startDate: new Date('2026-10-01'),
        endDate: new Date('2026-10-02'),
        reason: 'Extended weekend trip.',
        status: 'Rejected',
      },
    ]);

    console.log('✅ Leave requests populated with diverse statuses and categories!');

    // 3. Create Attendance Logs (both historical and today)
    const today = new Date();
    const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(
      today.getDate()
    ).padStart(2, '0')}`;

    const yesterday = new Date(Date.now() - 86400000);
    const yesterdayStr = `${yesterday.getFullYear()}-${String(yesterday.getMonth() + 1).padStart(2, '0')}-${String(
      yesterday.getDate()
    ).padStart(2, '0')}`;

    const twoDaysAgo = new Date(Date.now() - 86400000 * 2);
    const twoDaysAgoStr = `${twoDaysAgo.getFullYear()}-${String(twoDaysAgo.getMonth() + 1).padStart(2, '0')}-${String(
      twoDaysAgo.getDate()
    ).padStart(2, '0')}`;

    await Attendance.insertMany([
      // Today logs
      {
        employee: users[1]._id, // Alex Rivera
        date: todayStr,
        checkIn: new Date(today.setHours(9, 12, 0, 0)),
        checkOut: null,
        status: 'Present',
        workHours: 0,
      },
      {
        employee: users[2]._id, // Priya Sharma
        date: todayStr,
        checkIn: new Date(today.setHours(8, 55, 0, 0)),
        checkOut: null,
        status: 'Present',
        workHours: 0,
      },
      {
        employee: users[3]._id, // Marcus Vance
        date: todayStr,
        checkIn: new Date(today.setHours(9, 48, 0, 0)),
        checkOut: null,
        status: 'Late',
        workHours: 0,
      },
      {
        employee: users[4]._id, // Elena Rostova
        date: todayStr,
        checkIn: new Date(today.setHours(8, 45, 0, 0)),
        checkOut: null,
        status: 'Present',
        workHours: 0,
      },
      // Yesterday logs (complete with checkOut)
      {
        employee: users[1]._id,
        date: yesterdayStr,
        checkIn: new Date(yesterday.setHours(9, 5, 0, 0)),
        checkOut: new Date(yesterday.setHours(17, 35, 0, 0)),
        status: 'Present',
        workHours: 8.5,
      },
      {
        employee: users[2]._id,
        date: yesterdayStr,
        checkIn: new Date(yesterday.setHours(9, 0, 0, 0)),
        checkOut: new Date(yesterday.setHours(17, 0, 0, 0)),
        status: 'Present',
        workHours: 8.0,
      },
      {
        employee: users[3]._id,
        date: yesterdayStr,
        checkIn: new Date(yesterday.setHours(10, 15, 0, 0)),
        checkOut: new Date(yesterday.setHours(18, 15, 0, 0)),
        status: 'Late',
        workHours: 8.0,
      },
      // Two days ago
      {
        employee: users[1]._id,
        date: twoDaysAgoStr,
        checkIn: new Date(twoDaysAgo.setHours(9, 10, 0, 0)),
        checkOut: new Date(twoDaysAgo.setHours(17, 10, 0, 0)),
        status: 'Present',
        workHours: 8.0,
      },
    ]);

    console.log('✅ Attendance logs seeded with today’s active sessions and past metrics!');

    // 4. Create Company Announcements
    await Announcement.insertMany([
      {
        title: '🚀 Q4 Strategic All-Hands & Product Roadmap Preview',
        content:
          'Join the executive leadership team this Friday at 4:00 PM EST for our quarterly town hall. We will share milestone achievements, new enterprise tier metrics, and our 2027 technical roadmap.',
        author: 'Sarah Connor (VP People)',
      },
      {
        title: '🛡️ Annual Information Security & SOC 2 Compliance Window',
        content:
          'A reminder to all workforce members that mandatory ISO/SOC 2 awareness modules are due by end-of-month. Please verify your 2FA configurations across all enterprise apps.',
        author: 'Security Operations',
      },
      {
        title: '🌴 Flexible Remote Work & Health Wellness Stipends',
        content:
          'StaffSync has renewed our wellness reimbursement benefit. Full-time team members can claim up to $600 annually for gym memberships, mental health apps, and home workspace ergonomic improvements.',
        author: 'People & Benefits Team',
      },
    ]);

    console.log('✅ Announcements published!');
    console.log('\n========================================');
    console.log('🎉 Database successfully seeded with demo data!');
    console.log('Demo Login credentials:');
    console.log('👉 Admin:    admin@staffsync.com / password123');
    console.log('👉 Employee: alex@staffsync.com  / password123');
    console.log('👉 Employee: priya@staffsync.com / password123');
    console.log('========================================\n');

    process.exit(0);
  } catch (err) {
    console.error('❌ Seeding error:', err.message);
    process.exit(1);
  }
};

seedDB();
