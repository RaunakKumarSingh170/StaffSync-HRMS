const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['Admin', 'Employee'], default: 'Employee' },
    department: { type: String, default: 'General' },
    position: { type: String, default: 'Staff' },
    salary: { type: Number, default: 0 },
    status: { type: String, enum: ['Active', 'On Leave', 'Remote', 'Inactive'], default: 'Active' },
    avatar: { type: String, default: '' },
    leaveQuota: {
      casual: { type: Number, default: 12 },
      sick: { type: Number, default: 10 },
      earned: { type: Number, default: 15 },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);
