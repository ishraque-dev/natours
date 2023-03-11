const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
exports.deleteOne = function (Model) {
  return catchAsync(async function (req, res, next) {
    const doc = await Model.findByIdAndDelete(req.params.id);
    if (!doc) {
      return next(new AppError('No document found!', 400));
    }
    res.status(204).json({
      status: 'success',
      data: null,
    });
  });
};
exports.updateOne = function (Model) {
  return catchAsync(async function (req, res, next) {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!doc) {
      return next(new AppError('No document found', 400));
    }
    res.status(200).json({
      status: 'success',
      data: doc,
    });
  });
};
exports.getOne = function (Model, options) {
  return catchAsync(async (req, res, next) => {
    let query = Model.findById(req.params.id);
    if (options.path === 'populate') {
      query = query.populate('reviews');
    }
    const doc = await query;
    if (!doc) {
      return next(
        new AppError('There is not found document with this id', 404)
      );
    }
    res.status(200).json({
      status: 'success',
      data: {
        doc,
      },
    });
  });
};
