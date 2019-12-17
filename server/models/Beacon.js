const { model, Schema } = require("mongoose");

const BeaconSchema = new Schema({
    name: String,
    description: String,
    location: String,
    date: String,
    time: String,
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    createdAt: String
});

module.exports = model("Beacon", BeaconSchema);
