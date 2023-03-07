const Review = require('../models/reviewModel');
const catchAsync = require('../utils/catchAsync');

// Get all Reviews
exports.getAllReviews = catchAsync(async function (req, res, next) {
  const reviews = await Review.find();

  res.status(200).json({
    results: reviews.length,
    reviews,
  });
});
// Create a new Review

exports.createReview = catchAsync(async function (req, res, next) {
  const review = await Review.create(req.body);
  res.status(201).json({
    message: 'success',
    review,
  });
});
