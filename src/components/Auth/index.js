const bcrypt = require('bcrypt');
const ejs = require('ejs');
const jwt = require('jsonwebtoken');
const path = require('path');
const UserService = require('../User/service');
const AuthService = require('./service');
const AuthValidation = require('./validation');
const {
  HASH_SALT, BASE_URL, PORT, TOKENS,
} = require('../../config/credentials');
const { generateTokens, updateOrSaveToken, sendEmail } = require('./helper');
const ValidationError = require('../../error/ValidationError');

/**
 * @function
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.NextFunction} next
 * @returns {Promise < void >}
 */
async function signUp(req, res, next) {
  try {
    const { error, value } = AuthValidation.signUp(req.body);

    if (error) throw new ValidationError(error.details);

    const isUser = UserService.isExists(value.email);

    if (isUser) throw new Error('Email already exists!');

    const hashPassword = bcrypt.hashSync(value.password, HASH_SALT);

    const userData = {
      firstName: value.firstName,
      lastName: value.lastName,
      email: value.email,
      password: hashPassword,
    };

    const user = await UserService.create(userData);

    res.render('welcome', {
      data: {
        firstName: user.firstName,
      },
    });
  } catch (error) {
    next(error);
  }
}

/**
 * @function
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.NextFunction} next
 * @returns {accessToken, refreshToken}
 */
async function signIn(req, res, next) {
  try {
    const { error, value } = AuthValidation.signIn(req.body);
    if (error) throw new ValidationError(error.details);

    const user = await UserService.searchByEmail(value.email);

    if (user === null) throw new Error('User does not exists!');

    if (!bcrypt.compareSync(value.password, user.password)) {
      throw new Error('Invalid email or password!');
    }

    const tokens = generateTokens(user);

    updateOrSaveToken(user._id, tokens.refreshToken);
    res
      .status(200)
      .cookie('accessToken', `Bearer ${tokens.accessToken}`, {
        maxAge: 1000 * 60 * 30, httpOnly: true,
      })
      .cookie('refreshToken', tokens.refreshToken, { maxAge: 1000 * 60 * 60 * 24, httpOnly: true })
      .cookie('user_id', `${user._id}`)
      .redirect('/');
  } catch (error) {
    next(error);
  }
}

/**
 * @function
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.NextFunction} next
 * @returns {Promise < void >}
 */
async function refreshToken(req, res, next) {
  try {
    const { error, value } = AuthValidation.Tokens(req.cookies);

    if (error) throw new ValidationError(error.details);

    const requestToken = await AuthService.searchToken(value.refreshToken);

    if (requestToken === null) throw new Error('Token is invalid');

    const user = await UserService.findById(requestToken.userId);

    const tokens = generateTokens(user);

    updateOrSaveToken(user._id, tokens.refreshToken);

    res
      .status(200)
      .cookie('accessToken', `Bearer ${tokens.accessToken}`, {
        maxAge: 1000 * 60 * 30, httpOnly: true,
      })
      .cookie('refreshToken', tokens.refreshToken, { maxAge: 1000 * 60 * 60 * 24, httpOnly: true })
      .redirect(301, '/chatroom');
  } catch (error) {
    next(error);
  }
}

/**
 * @function
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.NextFunction} next
 * @returns {Promise < void >}
 */
async function forgotPassword(req, res, next) {
  try {
    const { error, value } = AuthValidation.forgotPassword(req.body);

    if (error || value.email === undefined) throw new ValidationError(error.details);

    const user = await UserService.searchByEmail(value.email);

    if (user === null) throw new Error('User with this email does not exists!');

    const newTokens = generateTokens(user);

    updateOrSaveToken(user._id, newTokens.accessToken);

    const link = `${BASE_URL}:${PORT}/v1/auth/password-reset/${newTokens.accessToken}`;

    const html = await ejs.renderFile(path.join(__dirname, '../../views/email-page.ejs'), { firstName: user.firstName, link });

    sendEmail(user.email, 'Password reset', html);

    res
      .status(200)
      .render('forgot-reset-success', {
        data: {
          message: 'Email sent successfully. Check spam folder also',
        },
      });
  } catch (error) {
    next(error);
  }
}

/**
 * @function
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.NextFunction} next
 * @returns {Promise < void >}
 */
async function resetPassword(req, res, next) {
  try {
    const { error, value } = AuthValidation.resetPassword(req.body);

    if (error) throw new ValidationError(error.details);

    const token = await AuthService.searchToken(req.cookies.refreshToken);

    if (token === null) throw new Error('Invalid or expired link');

    const hashPassword = bcrypt.hashSync(value.password, HASH_SALT);

    await UserService.updateById(token.userId, { password: hashPassword });

    res.render('forgot-reset-success', {
      data: {
        message: 'Password changed',
      },
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  signUp,
  signIn,
  refreshToken,
  forgotPassword,
  resetPassword,
};
