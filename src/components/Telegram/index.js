const { Markup } = require('telegraf');
const { startHandler } = require('./handlers');

module.exports = {
  /**
       * @function
       * @description telegram bot
       * @param {express.Application} bot
       * @returns void
       */
  init(bot) {
    bot.start(startHandler);
  },
};
