const express = require("express");

const router = express.Router();

const playersController = require('../controllers/game')

router.get("/", playersController.getPlayers);

router.get("/join-game", playersController.getJoinGame);

router.post("/join-game", playersController.postJoinGame);

router.get("/checkout", playersController.getCheckout);

router.get('/checkout/success', playersController.getCheckoutSuccess);

router.get('/checkout/cancel', playersController.getCheckout);

router.post("/cancel", playersController.postCancel);

module.exports = router;



