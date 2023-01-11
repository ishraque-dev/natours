const express = require('express');
const morgan = require('morgan');
const tourRouter = require('./routes/tourRoute');
const userRouter = require('./routes/userRoute');

const app = express();
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}
app.use(express.json());

// user routes

// tour routers
app.use('/api/v1/tours', tourRouter);

// user Routes
app.use('/api/v1/users', userRouter);

module.exports = app;
