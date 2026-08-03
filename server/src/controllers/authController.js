import { validationResult } from 'express-validator';
import User from '../models/User.js';
import { AppError, asyncHandler } from '../middleware/errorHandler.js';
import { generateToken } from '../middleware/auth.js';

export const register = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new AppError(errors.array()[0].msg, 400);
  }

  const { name, email, password } = req.body;

  const exists = await User.findOne({ email });
  if (exists) {
    throw new AppError('Email already registered', 400);
  }

  const user = await User.create({
    name,
    email,
    password,
    role: 'student',
  });

  res.status(201).json({
    success: true,
    data: {
      token: generateToken(user._id),
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    },
  });
});

export const login = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new AppError(errors.array()[0].msg, 400);
  }

  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user || !(await user.matchPassword(password))) {
    throw new AppError('Invalid email or password', 401);
  }

  res.json({
    success: true,
    data: {
      token: generateToken(user._id),
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    },
  });
});

export const getMe = asyncHandler(async (req, res) => {
  res.json({
    success: true,
    data: {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role,
    },
  });
});
