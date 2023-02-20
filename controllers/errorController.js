const AppError = require('../utils/appError');

const handleValidationErrorDB = function (err) {
  const message = `${err.message}`;
  return new AppError(message, 400);
};
const sedErrorDev = function (error, res) {
  res.status(error.statusCode).json({
    status: error.status,
    message: error.message,
    stack: error.stack,
    error: error.errors,
  });
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
    let handledError;
    if (error.name === 'ValidationError') {
      handledError = handleValidationErrorDB(error);
    }
    sendErrorProduction(handledError, res);
  }
};
