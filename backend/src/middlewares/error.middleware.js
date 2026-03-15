// src/middlewares/error.middleware.js
export const errorHandler = (err, req, res, next) => {
  console.error(err);

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      message: 'Validation failed',
      errors: Object.values(err.errors).map((e) => e.message),
    });
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    return res.status(400).json({
      message: 'Duplicate field value entered',
      errors: [JSON.stringify(err.keyValue)],
    });
  }

  // Cast error (e.g. invalid ObjectId)
  if (err.name === 'CastError') {
    return res.status(400).json({
      message: 'Resource not found',
      errors: [`Invalid ${err.path}: ${err.value}`],
    });
  }

  res.status(err.status || 500).json({
    message: err.message || 'Server Error',
    errors: err.errors || [],
  });
};