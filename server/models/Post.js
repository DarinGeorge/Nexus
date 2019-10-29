const { model, Schema } = require('mongoose');

const PostSchema = new Schema({
  body: String,
  alias: String,
  createdAt: String,
  comments: [
    {
      body: String,
      alias: String,
      createdAt: String
    }
  ],
  user: {
    type: Schema.Types.ObjectId,
    ref: 'users'
  }
});

module.exports = model('Post', PostSchema);
