const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { promisify } = require('util');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const sendMail = require('../utils/sendMail');
const AppError = require('../utils/appError');

const signAToken = async function (id) {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};
const createAndSendToken = async function (user, statusCode, res) {
  const token = await signAToken(user._id);
  const cookieOptions = {
    expiresIn: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
    httpOnly: true,
  };
  if (process.env.NODE_ENV === 'production') {
    cookieOptions.secure = true;
  }
  res.cookie('jwt', token, cookieOptions);
  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user,
    },
  });
};
exports.signup = catchAsync(async function (req, res, next) {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    passwordChangedAt: req.body.passwordChangedAt,
    role: req.body.role,
  });
  await createAndSendToken(newUser, 201, res);
  // const token = await signAToken(newUser._id);
  // res.status(201).json({
  //   status: 'success',
  //   token,
  //   data: {
  //     user: newUser,
  //   },
  // });
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
  // const token = await signAToken(user._id);
  // res.status(200).json({
  //   status: 'success',
  //   token,
  //   user,
  // });
  await createAndSendToken(user, 200, res);
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
exports.restrictTo = function (...roles) {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError('You do not have permission to perform this action', 403)
      );
    }
    next();
  };
};
exports.forgotPassword = catchAsync(async function (req, res, next) {
  // 1. Get User based on posted email
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(
      new AppError('There is no user with email ' + req.body.email, 404)
    );
  }
  // 2. Generate the random token
  const resetToken = user.createPasswordResetToken();
  await user.save({
    validateBeforeSave: false,
  });
  // 3. Send it to the users email address
  const resetURL = `${req.protocol}://${req.get(
    'host'
  )}/api/v1/users/resetPassword/${resetToken}`;
  const message = `Forgot your password? Click the link below to reset your password \n ${resetURL} `;
  try {
    console.log(user.email);
    await sendMail({
      receiver: user.email,
      subject: 'Reset you password ',
      message,
    });
    res.status(200).json({
      status: 'success',
      message: 'Token has been send successfully',
    });
  } catch (error) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    return next(
      new AppError(
        'There was an error sending the email. Please try again later',
        500
      )
    );
  }
});
exports.resetPassword = catchAsync(async function (req, res, next) {
  // 1. Get user based on the token
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');
  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });
  //2. If token is valid and there is a user then set the new password
  if (!user) {
    return next(new AppError('Token is invalid or expired', 400));
  }
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  user.save();
  //3.Update the changePasswordAt property for the user
  //4. Log the user in and send JWT
  // const token = await signAToken(user._id);
  // res.status(200).json({
  //   status: 'success',
  //   token,
  // });
  await createAndSendToken(user, 200, res);
});
