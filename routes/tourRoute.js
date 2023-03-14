const express = require('express');

const {
  getAllTour,
  createTour,
  getTour,
  updateTour,
  deleteTour,
  aliasTopTour,
  getTourStats,
  getMonthlyPlan,
} = require('../controllers/tourController');
const reviewRouter = require('../routes/reviewRoute');
const { protect, restrictTo } = require('../controllers/authController');
const router = express.Router();
router.use('/:tourId/reviews', reviewRouter);
// router.param('id', checkId);
router.route('/tours-stats').get(getTourStats);
router
  .route('/get-monthly-plan/:year')
  .get(protect, restrictTo('admin', 'lead-guide', 'guide'), getMonthlyPlan);
router.route('/top-5-cheap').get(aliasTopTour, getAllTour);
router
  .route('/')
  .get(getAllTour)
  .post(protect, restrictTo('admin', 'lead-guide'), createTour);
router
  .route('/:id')
  .get(getTour)
  .patch(protect, restrictTo('admin', 'lead-guide'), updateTour)
  .delete(protect, restrictTo('admin', 'lead-guide'), deleteTour);
module.exports = router;
