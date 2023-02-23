const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');
const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'User mast have a name'],
  },
  email: {
    type: String,
    required: [true, 'User mast have a email'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please enter a valid email'],
  },
  photo: {
    type: String,
    default: null,
  },
  password: {
    type: String,
    required: [true, 'User mast have a password'],
    minlength: 8,
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Confirm your password'],
    validate: {
      validator: function (el) {
        return el === this.password;
      },
      message: 'Password not matched properly',
    },
  },
  passwordChangedAt: {
    type: Date,
  },
});
UserSchema.pre('save', async function (next) {
  if (!this.isDirectModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
  next();
});
// Instance methods
UserSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};
UserSchema.methods.afterChangePassword = function (JWT_Exp_TimeStamp) {
  if (this.passwordChangedAt) {
    const changeTimeStamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    return JWT_Exp_TimeStamp < changeTimeStamp;
  }
  // false means not changed
  return false;
};
const User = mongoose.model('User', UserSchema);
module.exports = User;
