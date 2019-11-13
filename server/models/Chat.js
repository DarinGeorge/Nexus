const { model, Schema } = require("mongoose");
const User = require("./User");

const ChatSchema = new Schema(
  {
    title: String,
    users: [
      {
        type: Schema.Types.ObjectId,
        ref: "User"
      }
    ],
    lastMessage: {
      type: Schema.Types.ObjectId,
      ref: "Message"
    }
  },
  {
    timestamps: true
  }
);

const USER_LIMIT = 5;

ChatSchema.pre("save", async function() {
  if (!this.title) {
    const users = await User.where("_id")
      .in(this.users)
      .limit(USER_LIMIT)
      .select("alias");
    let title = users.map(user => user.alias).join(", ");

    if (this.users.length > USER_LIMIT) {
      title += "...";
    }

    this.title = title;
  }
});

module.exports = model("Chat", ChatSchema);
