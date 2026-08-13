// middleware/errorHandler.js
// Central error handler - catches any error passed via next(err)
// and returns a clean JSON response.

const errorHandler = (err, req, res, next) => {
  // Log the full error server-side for debugging
  console.error('Error:', err.message);
  if (process.env.NODE_ENV === 'development') {
    console.error(err.stack);
  }

  // Mongoose validation errors (e.g. required field missing)
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map((e) => e.message);
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors,
    });
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    return res.status(409).json({
      success: false,
      message: 'Duplicate entry detected.',
    });
  }

  // Default - unknown server error
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
};

module.exports = errorHandler;
