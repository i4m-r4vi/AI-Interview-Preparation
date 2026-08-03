import Category from '../models/Category.js';
import { AppError, asyncHandler } from '../middleware/errorHandler.js';

export const getCategories = asyncHandler(async (_req, res) => {
  const categories = await Category.find({ isActive: true }).sort({ name: 1 });
  res.json({ success: true, data: categories });
});

export const getAllCategories = asyncHandler(async (_req, res) => {
  const categories = await Category.find().sort({ name: 1 });
  res.json({ success: true, data: categories });
});

export const createCategory = asyncHandler(async (req, res) => {
  const { name, description } = req.body;
  if (!name?.trim()) {
    throw new AppError('Category name is required', 400);
  }

  const exists = await Category.findOne({ name: name.trim() });
  if (exists) {
    throw new AppError('Category already exists', 400);
  }

  const category = await Category.create({
    name: name.trim(),
    description: description || '',
  });

  res.status(201).json({ success: true, data: category });
});

export const updateCategory = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);
  if (!category) {
    throw new AppError('Category not found', 404);
  }

  if (req.body.name) category.name = req.body.name.trim();
  if (req.body.description !== undefined) category.description = req.body.description;
  if (req.body.isActive !== undefined) category.isActive = req.body.isActive;

  await category.save();
  res.json({ success: true, data: category });
});

export const deleteCategory = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);
  if (!category) {
    throw new AppError('Category not found', 404);
  }
  await category.deleteOne();
  res.json({ success: true, message: 'Category deleted' });
});
