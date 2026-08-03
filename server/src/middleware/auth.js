import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { AppError, asyncHandler } from './errorHandler.js';

export const protect = asyncHandler(async (req, _res, next) => {
  let token;
  const authHeader = req.headers.authorization;

  if (authHeader?.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1];
  }

  if (!token) {
    throw new AppError('Not authorized, no token', 401);
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      throw new AppError('User not found', 401);
    }
    req.user = user;
    next();
  } catch {
    throw new AppError('Not authorized, invalid token', 401);
  }
});

export const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });
