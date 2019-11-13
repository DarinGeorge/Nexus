const { model, Schema } = require("mongoose");

const UserSchema = new Schema({
  alias: String,
  password: String,
  email: String,
  birthday: Date,
  createdAt: String,
  chats: [
    {
      type: Schema.Types.ObjectId,
      ref: "Chat"
    }
  ]
});

module.exports = model("User", UserSchema);
