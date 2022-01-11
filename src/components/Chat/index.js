const UserService = require('../User/service');
const AuthService = require('../Auth/service');
const TokenValidation = require('../Auth/validation');
const ValidationError = require('../../error/ValidationError');

/**
 * @function
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.NextFunction} next
 * @returns {Promise < void >}
 */
const chatRoom = async (req, res, next) => {
  try {
    const { error, value } = TokenValidation.Tokens(req.cookies);

    if (error) throw new ValidationError(error.details);

    const token = await AuthService.searchToken(value.refreshToken);

    const user = await UserService.findById(token.userId);

    res
      .status(200)
      .render('chat', {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        picture: user.picture,
        id: user.id,

      });
  } catch (error) {
    next(error);
  }
};

const socketEvents = (io) => {
  io.on('connection', (socket) => {
    // Welcome current user
    socket.emit('message', 'Welcome to ChatCord!');

    // Broadcast when a user connects
    socket.broadcast.emit('message', 'A user has joined the chat!');

    // Runs when client disconnects
    socket.on('disconnect', () => {
      io.emit('message', 'A user has left the chat!');
    });
  });
};

module.exports = {
  socketEvents,
  chatRoom,
};
