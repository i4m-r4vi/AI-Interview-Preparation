import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { seedAdmin } from './seedAdmin.js';
import { seedCategories } from './seedCategories.js';

dotenv.config();

async function run() {
  try {
    await seedAdmin();
    await seedCategories();
    console.log('All seeds completed');
  } catch (err) {
    console.error('Seed failed:', err);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
  }
}

run();
