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
  updateMe,
  deleteMe,
  getMe,
} = require('../controllers/userController');

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/forgotPassword', forgotPassword);
router.patch('/resetPassword/:token', resetPassword);

// Protecting all routes that needs to be protected
router.use(protect);

router.patch('/updateMe', updateMe);
router.delete('/deleteMe/', deleteMe);
router.get('/me', getMe, getUser);
// ==========================
router.route('/').get(getAllUser);
router.route('/:id').get(getUser).patch(updateUser).delete(deleteUser);
module.exports = router;
