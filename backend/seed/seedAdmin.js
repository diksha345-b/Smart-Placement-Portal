/**
 * Seed script to create an initial admin account (and optionally demo data).
 * Run with: npm run seed
 *
 * Admin credentials are taken from env vars or fall back to sensible defaults:
 *   ADMIN_EMAIL=admin@portal.com
 *   ADMIN_PASSWORD=Admin@123
 */
require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const User = require('../models/User');

const run = async () => {
  await connectDB();

  const email = process.env.ADMIN_EMAIL || 'admin@portal.com';
  const password = process.env.ADMIN_PASSWORD || 'Admin@123';

  const existing = await User.findOne({ email });
  if (existing) {
    console.log(`Admin already exists: ${email}`);
  } else {
    await User.create({
      name: 'Platform Admin',
      email,
      password,
      role: 'admin',
    });
    console.log('Admin account created:');
    console.log(`  email:    ${email}`);
    console.log(`  password: ${password}`);
  }

  await mongoose.connection.close();
  process.exit(0);
};

run().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
