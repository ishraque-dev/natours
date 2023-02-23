const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const signAToken = async function (id) {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};
exports.signup = catchAsync(async function (req, res, next) {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    passwordChangedAt: req.body.passwordChangedAt,
  });
  const token = await signAToken(newUser._id);
  res.status(201).json({
    status: 'success',
    token,
    data: {
      user: newUser,
    },
  });
});
exports.login = catchAsync(async function (req, res, next) {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError('Please provide your email and password', 400));
  }

  // Check if the user exist and password is correct
  const user = await User.findOne({ email }).select('+password');
  const correct = user && (await user.correctPassword(password, user.password));

  if (!user || !correct) {
    return next(new AppError('Incorrect email or password', 401));
  }
  // if everything is ok
  const token = await signAToken(user._id);
  res.status(200).json({
    status: 'success',
    token,
    user,
  });
});

// Protected middleware

exports.protect = catchAsync(async function (req, res, next) {
  // Getting token and check if it exists
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }
  if (!token)
    return next(new AppError('Unauthorized. Please login and try again.', 401));

  // Verify the token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // Check if user is still exist
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(
      new AppError('The user belongs to this token is not exist anymore!', 401)
    );
  }
  // Check if the user changed their password after the token was issued
  if (currentUser.afterChangePassword(decoded.iat)) {
    return next(new AppError('You password was Changed. Please login again '));
  }

  req.user = currentUser;
  // Grant access to the route
  next();
});
