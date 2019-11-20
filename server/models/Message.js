const { model, Schema } = require('mongoose');

const MessageSchema = new Schema({
  body: String,
  sender: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  chat: {
    type: Schema.Types.ObjectId,
    ref: 'Chat'
  },
  createdAt: String
});

module.exports = model('Message', MessageSchema);
