const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const constants = require("../lib/constants");

const gameSchema = new Schema({
  date: {
    type: String,
    required: true,
  },
  players: [
    {
      playerId: {
        type: Schema.Types.ObjectId,
        ref: "Player",
        required: true,
      },
      paymentStatus: {
        type: Boolean,
        required: true,
      },
    },
  ],
  fee: {
    type: Number,
    required: true,
  },
  isFinished: {
    type: Boolean,
    required: true,
  },
  isSaved: {
    type: Boolean,
    required: true,
  },
});

gameSchema.methods.addPlayer = function (player) {
  this.players.push({ playerId: player._id, paymentStatus: false });
  this.fee = (constants.COURT_FEE / this.players.length).toFixed(2);
  this.save();
};

gameSchema.methods.deletePlayer = function (player) {
  const playerIndex = this.players.findIndex((p) => {
    return p.playerId.toString() === player._id.toString();
  });
  this.players.splice(playerIndex, 1);
  this.save();
};

gameSchema.methods.finishGame = function () {
  this.isFinished = true;
  this.save();
};

gameSchema.methods.saveGame = function () {
  this.isSaved = true;
  this.save();
};

gameSchema.methods.pay = function (player) {
  const playerIndex = this.players.findIndex((p) => {
    return p.playerId.toString() === player._id.toString();
  });
  this.players[playerIndex].paymentStatus = true;
  this.save();
};

module.exports = mongoose.model("Game", gameSchema);
