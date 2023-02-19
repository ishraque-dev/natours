const express = require('express');
const morgan = require('morgan');
const tourRouter = require('./routes/tourRoute');
const userRouter = require('./routes/userRoute');
const AppError = require('./utils/appError');

const globalErrorController = require('./controllers/errorController');

const app = express();
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}
app.use(express.json());

//ROUTERS
// tour routers
app.use('/api/v1/tours', tourRouter);
// user Routes
app.use('/api/v1/users', userRouter);

// =======================
// MIDDLEWARE: Handling undefined routes
app.all('*', (req, res, next) => {
  next(new AppError(`Cannot find ${req.originalUrl} on this server`, 404));
});
// MIDDLEWARE: Handling global errors
app.use(globalErrorController);

module.exports = app;
