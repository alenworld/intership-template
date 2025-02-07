const { Router } = require('express');
const AuthComponent = require('.');
const AuthMiddleware = require('./middleware');

/**
 * Express router to mount user related functions on.
 * @type {Express.Router}
 * @const
 */
const router = Router();

/**
 * Route serving a signing up users
 * @name /auth/signUp
 * @function
 * @inner
 * @param {string} path - Express path
 * @param {callback} middleware - Express middleware.
 */
router
  .get('/signUp', (req, res) => res.render('signup'))
  .post('/signUp', AuthComponent.signUp);

/**
 * Route serving a signing in users
 * @name /auth/signIn
 * @function
 * @inner
 * @param {string} path - Express path
 * @param {callback} middleware - Express middleware.
 */
router
  .get('/signIn', (req, res) => res.render('signin'))
  .post('/signIn', AuthComponent.signIn);

/**
 * Route serving for refreshing token
 * @name /auth/refreshtoken
 * @function
 * @inner
 * @param {string} path - Express path
 * @param {callback} middleware - Express middleware.
 */
router.get('/refreshtoken', AuthComponent.refreshToken);

/**
 * Route serving forgot password
 * @name /auth/forgot_password
 * @function
 * @inner
 * @param {string} path - Express path
 * @param {callback} middleware - Express middleware.
 */
router
  .get('/forgot-password', (req, res) => res.render('forgot'))
  .post('/forgot-password', AuthComponent.forgotPassword);

/**
 * Route serving for reset password
 * @name /auth/password_reset/:token
 * @function
 * @inner
 * @param {string} path - Express path
 * @param {callback} middleware - Express middleware.
 */
router
  .get('/password-reset/:token', (req, res) => res.render('reset'))
  .post('/password-reset/:token', AuthComponent.resetPassword);

module.exports = router;
