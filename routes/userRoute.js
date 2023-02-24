const express = require('express');
const {
  signup,
  login,
  protect,
  forgotPassword,
  resetPassword,
} = require('../controllers/authController');

const {
  getAllUser,
  createUser,
  getUser,
  updateUser,
  deleteUser,
} = require('../controllers/userController');

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);

router.post('/forgotPassword', forgotPassword);
router.patch('/resetPassword/:token', resetPassword);

// ==========================
router.route('/').get(protect, getAllUser);
router.route('/:id').get(getUser).patch(updateUser).delete(deleteUser);
module.exports = router;
