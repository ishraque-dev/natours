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

const router = express.Router();
// router.param('id', checkId);
router.route('/tours-stats').get(getTourStats);
router.route('/get-monthly-plan/:year').get(getMonthlyPlan);
router.route('/top-5-cheap').get(aliasTopTour, getAllTour);
router.route('/').get(getAllTour).post(createTour);
router.route('/:id').get(getTour).patch(updateTour).delete(deleteTour);
module.exports = router;
