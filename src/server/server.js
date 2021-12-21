const express = require('express');
const { Telegraf } = require('telegraf');
const middleware = require('../config/middleware');
const routes = require('../config/router');
const { ValidationError } = require('../error');
const { TELEGRAM_BOT } = require('../config/credentials');

/**
 * @type {express}
 * @constant {express.Application}
 */
const bot = new Telegraf(TELEGRAM_BOT.TOKEN);

/**
 * @type {express}
 * @constant {express.Application}
 */
const app = express();

/**
 * @description express.Application Error Handler
 */
bot.telegram.setWebhook(`${TELEGRAM_BOT.DOMAIN + TELEGRAM_BOT.HOOK_PATH}`);
app.use(bot.webhookCallback(TELEGRAM_BOT.HOOK_PATH));

/**
 * @description express.Application Middleware
 */
middleware.init(app);

/**
 * @description express.Application Routes
 */
routes.init(app);

/**
 * @description express.Application Error Handler
 */
app.use(ValidationError);

/**
 * @description sets port 3000 to default or unless otherwise specified in the environment
 */
app.set('port', process.env.PORT || 3000);

module.exports = app;
