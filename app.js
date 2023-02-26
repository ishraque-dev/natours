const express = require('express');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');
const mongoSanitize = require('express-mongo-sanitize');
const xxs = require('xss-clean');
const hpp = require('hpp');
const tourRouter = require('./routes/tourRoute');
const userRouter = require('./routes/userRoute');
const AppError = require('./utils/appError');
const helmet = require('helmet');
const globalErrorController = require('./controllers/errorController');

const app = express();
// GLOBAL MIDDLEWARE'S
// Set security HTTP headers
app.use(helmet());
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

//Body parser
app.use(
  express.json({
    limit: '10kb',
  })
);
// Data sanitization against NoSQL query Injection
app.use(mongoSanitize());
// Limit request from same IP
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: 'Too many requests from this IP. Please try again in 15 minutes',
});
// Data sanitization against XSS attacks
app.use(xxs());
app.use('/api', limiter);
// Prevent parameter pollution
app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsQuantity',
      'averageRating',
      'maxGroupSize',
      'difficulty',
      'price',
    ],
  })
);
//APP MIDDLEWARE
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
