const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  hashedPassword: { type: String, required: true }
});

userSchema.methods.comparePassword = function(password) {
  return bcrypt.compareSync(password, this.hashedPassword);
};

const User = mongoose.model('User', userSchema);
module.exports = User;
