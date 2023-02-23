const AppError = require('../utils/appError');

const handleValidationErrorDB = function (err) {
  const errors = Object.values(err.errors).map((el) => el.message);
  const message = errors.join('. ');
  return new AppError(message, 400);
};
const handleDuplicateFieldErrorDB = function (err) {
  let value = err.message.match(/(["'])(?:(?=(\\?))\2.)*?\1/);

  const message = `Duplicate key in ${value}.Please choose a different one.`;
  return new AppError(message, 400);
};
const handleJWTError = function (error) {
  const message = error.message;
  return new AppError(message, 401);
};
const sedErrorDev = function (error, res) {
  res.status(error.statusCode).json({
    status: error.status,
    message: error.message,
    stack: error.stack,
    error: error,
  });
};
const handleTokenExpiredError = function (error) {
  return new AppError(
    'You token has expired. Please login again to continue.',
    401
  );
};
const sendErrorProduction = function (error, res) {
  if (error.isOperational) {
    res.status(error.statusCode).json({
      status: error.status,
      message: error.message,
    });
  } else {
    // console.error('Error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Something went wrong',
    });
  }
};

module.exports = (error, req, res, next) => {
  error.statusCode = error.statusCode || 500;
  error.status = error.status || 'error';
  if (process.env.NODE_ENV === 'development') {
    sedErrorDev(error, res);
  } else if (process.env.NODE_ENV === 'production') {
    let handledError = { ...error };
    if (error.name === 'ValidationError') {
      handledError = handleValidationErrorDB(error);
    } else if (error.code === 11000) {
      handledError = handleDuplicateFieldErrorDB(error);
    } else if (error.name === 'JsonWebTokenError') {
      handledError = handleJWTError(error);
    } else if (error.name === 'TokenExpiredError') {
      handledError = handleTokenExpiredError(error);
    }
    sendErrorProduction(handledError, res);
  }
};
