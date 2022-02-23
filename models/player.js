const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const playerSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  position: {
    type: String,
    required: true
  },
  gameNum: {
    type: Number,
    required: true
  },
  resetToken: String,
  resetTokenExpiration: Date
})

playerSchema.methods.joinGame = function () {
  this.gameNum += 1;
  this.save();
};

playerSchema.methods.cancelGame = function () {
  this.gameNum -= 1;
  this.save();
};

module.exports = mongoose.model('Player', playerSchema);
