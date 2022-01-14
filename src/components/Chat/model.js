const { Schema } = require('mongoose');
const connections = require('../../config/connection');

const MessageSchema = new Schema(
  {
    message: {
      type: String,
      required: true,
    },
    numberOfMessage: {
      type: Number,
      required: true,
    },
    sentBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    collection: 'messagemodel',
    versionKey: false,
  },
);

module.exports = connections.model('MessageModel', MessageSchema);
