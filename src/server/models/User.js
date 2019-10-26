const { model, Schema } = require('mongoose');

const UserSchema = new Schema({
  alias: String,
  password: String,
  email: String,
  birthday: Date,
  createdAt: String
});

module.exports = model('User', userSchema);
