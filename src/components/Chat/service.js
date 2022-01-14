const MessageModel = require('./model');

/**
 * @exports
 * @method create
 * @param {object} message
 * @summary save message to db
 * @returns {Promise<MessageModel>}
 */
function create(msg) {
  return MessageModel.create(msg);
}

/**
 * @exports
 * @method findAll
 * @param {}
 * @summary get array of all messages
 * @returns Promise<UserModel[]>
 */
function findAll() {
  return MessageModel.find({});
}

module.exports = {
  create,
  findAll,
};
