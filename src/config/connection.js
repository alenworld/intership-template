const mongoose = require('mongoose');
const { MONGO_URI } = require('./credentials');

const connectOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

module.exports = mongoose.createConnection(MONGO_URI, connectOptions);
