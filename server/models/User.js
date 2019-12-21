const { model, Schema } = require('mongoose');

const UserSchema = new Schema({
  alias: String,
  password: String,
  email: String,
  birthday: Date,
  createdAt: String,
  online: Boolean
});

module.exports = model('User', UserSchema);
