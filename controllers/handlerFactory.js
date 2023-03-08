const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
exports.deleteOne = function (Model) {
  return catchAsync(async function (req, res, next) {
    const doc = await Model.findByIdAndDelete(req.params.id);
    if (!doc) {
      return next(new AppError('No document found!'));
    }
    res.status(204).json({
      status: 'success',
      data: null,
    });
  });
};
