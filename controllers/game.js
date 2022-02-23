const { default: mongoose } = require("mongoose");
const Player = require("../models/player");
const getDate = require("../util/getDate");
const constants = require("../lib/constants");
const stripe = require("stripe")(process.env.STRIPE_KEY);
const flash = require("connect-flash/lib/flash");

exports.getPlayers = (req, res, next) => {
  req.game.populate("players.playerId").then((game) => {
    const playerList = game.players;
    res.render("game/index", {
      players: playerList,
      game: game,
      path: "/",
      pageTitle: "Players",
      loginPlayer: req.session.player ? req.session.player : "",
      isAuthenticated: req.session.isLoggedIn,
      isAdmin: req.session.player
        ? req.session.player.email.toString() == constants.ADMIN_EMAIL
        : false,
      gamesPerStar: constants.GAMES_PER_STAR,
    });
  });
};

exports.getJoinGame = (req, res, next) => {
  let message = req.flash("error");
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render("game/join-game.ejs", {
    path: "/join-game",
    pageTitle: "Join Game",
    name: req.session.player.name,
    date: getDate(),
    address: constants.ADDRESS,
    gameFee: req.game.fee,
    isAuthenticated: req.session.isLoggedIn,
    time: constants.TIME,
    errorMessage: message,
  });
};

exports.postJoinGame = (req, res, next) => {
  const playerIndex = req.game.players.findIndex((p) => {
    return p.playerId.toString() === req.session.player._id.toString();
  });

  if (playerIndex >= 0 && req.session.player.email !== constants.ADMIN_EMAIL) {
    req.flash("error", "You can only join the game once!");
    return res.redirect("/join-game");
  }

  req.game.addPlayer(req.session.player);
  Player.findOne({ email: req.session.player.email })
    .then((player) => {
      player.joinGame();
    })
    .catch((err) => {
      console.log(err);
    });
  res.redirect("/");
};

exports.postCancel = (req, res, next) => {
  req.game.deletePlayer(req.session.player);
  Player.findOne({ email: req.session.player.email })
    .then((player) => {
      player.cancelGame();
    })
    .catch((err) => {
      console.log(err);
    });
  res.redirect("/");
};

exports.getCheckout = (req, res, next) => {
  const fee = req.game.fee;
  stripe.checkout.sessions
    .create({
      payment_method_types: ["card"],
      line_items: [
        {
          name: "Basketball Game Booking",
          description: "2 hours Basketball Game Booking",
          amount: fee * 100,
          currency: "GBP",
          quantity: 1,
        },
      ],
      success_url: req.protocol + "://" + req.get("host") + "/checkout/success",
      cancel_url: req.protocol + "://" + req.get("host") + "/checkout/cancel",
    })
    .then((session) => {
      res.render("game/checkout", {
        path: "/checkout",
        pageTitle: "Check Out",
        isAuthenticated: req.session.isLoggedIn,
        fee: req.game.fee,
        date: req.game.date,
        sessionId: session.id,
        address: constants.ADDRESS,
        time: constants.TIME,
      });
    });
};

exports.getCheckoutSuccess = (req, res, next) => {
  req.game.pay(req.session.player);
  res.redirect("/");
};
