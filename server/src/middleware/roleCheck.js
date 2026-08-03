import { AppError } from './errorHandler.js';

export const roleCheck = (...roles) => (req, _res, next) => {
  if (!req.user || !roles.includes(req.user.role)) {
    return next(new AppError('Access denied', 403));
  }
  next();
};
