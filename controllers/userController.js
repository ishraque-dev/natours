const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const factory = require('./handlerFactory')
exports.getAllUser = catchAsync(async (req, res, next) => {
  const users = await User.find();
  res.status(200).json({
    results: users.length,
    status: 'success',
    data: {
      users,
    },
  });
});
const filterObj = (obj, ...args) => {
  let newObj = {};
  Object.keys(obj).forEach((el) => {
    if (args.includes(el)) {
      newObj[el] = obj[el];
    }
  });
  return newObj;
};
exports.updateMe = catchAsync(async function (req, res, next) {
  //1. Create a error if user POST password data .
  if (req.body.password || req.body.passwordConfirm) {
    return next(new AppError('This router is not for password updates.', 400));
  }
  //2. Filter the unwanted fields
  const filteredBody = filterObj(req.body, 'name', 'email');
  // 3.Update the user
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser,
    },
  });
});
exports.deleteMe = catchAsync(async function (req, res, next) {
  await User.findByIdAndUpdate(req.user.id, {
    active: false,
  });
  res.status(200).json({
    status: 'success',
    message:
      'Your account has been successfully deleted. If you want to recover your account please contact to the administrator',
  });
});
// ============================================
exports.createUser = (req, res, next) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined',
  });
};
exports.getUser = (req, res, next) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined',
  });
};
exports.updateUser = (req, res, next) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined',
  });
};
exports.deleteUser =  factory.deleteOne(User)