const constants = require('../lib/constants');
const getDate = require("../util/getDate");

const Game = require("../models/game");

exports.postFinishGame = (req, res, next) => {
  req.game.finishGame();
  res.redirect("/");
};

exports.postSaveGame = (req, res, next) => {
  req.game.saveGame();
  const game = new Game({
      date: getDate(),
      players: [],
      fee: constants.COURT_FEE,
      isFinished: false,
      isSaved: false
    });
  game.save();
  res.redirect("/");
};