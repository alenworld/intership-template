const { Router } = require('express');
const jwt = require('jsonwebtoken');
const UserService = require('../User/service');
const { JWT } = require('../../config/credentials');

// const AuthMiddleware = require('../Auth/middleware');

/**
 * Express router to mount user related functions on.
 * @type {Express.Router}
 * @const
 */
const router = Router();

/**
 * Route serving list of users.
 * @name /chat
 * @function
 * @inner
 * @param {string} path - Express path
 * @param {callback} middleware - Express middleware.
 */
router.get('/chatroom', async (req, res) => {
  const token = req.cookies.refreshToken;
  const payload = jwt.verify(token, JWT.tokens.refresh.secret);
  const id = payload.userId;
  const user = await UserService.findById(id);

  res
    .render('chat', {
      id: user.id, firstName: user.firstName, lastName: user.lastName, picture: 'https://avatars.githubusercontent.com/u/62807002?v=4',
    });
});

module.exports = router;
