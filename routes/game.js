const express = require("express");

const router = express.Router();

const playersController = require('../controllers/game')

router.get("/", playersController.getPlayers);

router.get("/join-game", playersController.getJoinGame);

router.post("/add-player", playersController.postAddPlayer);

router.get("/checkout", playersController.getCheckout);

router.get('/checkout/success', playersController.getCheckoutSuccess);

router.get('/checkout/cancel', playersController.getCheckout);

// router.post("/pay", playersController.postPay);

router.post("/cancel", playersController.postCancel);

module.exports = router;



