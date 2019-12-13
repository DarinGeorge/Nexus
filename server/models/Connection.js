const { model, Schema } = require('mongoose');

const ConnectionSchema = new Schema({
    users: [
        {
            type: Schema.Types.ObjectId,
            ref: 'User'
        }
    ],
    createdAt: String
});

module.exports = model('Connection', ConnectionSchema);
