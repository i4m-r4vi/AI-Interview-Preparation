import dotenv from 'dotenv';
import connectDB from '../config/db.js';
import User from '../models/User.js';

dotenv.config();

export async function seedAdmin() {
  await connectDB();

  const email = process.env.ADMIN_EMAIL || 'admin@example.com';
  const password = process.env.ADMIN_PASSWORD || 'Admin@123';

  const existing = await User.findOne({ email, role: 'admin' });
  if (existing) {
    console.log('Admin already exists:', email);
    return;
  }

  await User.create({
    name: 'Admin',
    email,
    password,
    role: 'admin',
  });

  console.log('Admin seeded:', email);
}
