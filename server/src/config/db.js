import mongoose from 'mongoose';

const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/ai-interview';
  await mongoose.connect(uri);
  console.log('MongoDB connected');
};

export default connectDB;
