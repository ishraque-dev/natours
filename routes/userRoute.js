const express = require('express');
const { signup, login, protect } = require('../controllers/authController');

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

router.route('/').get(protect, getAllUser);
router.route('/:id').get(getUser).patch(updateUser).delete(deleteUser);
module.exports = router;
