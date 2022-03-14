const express = require("express");

const router = express.Router();

const playersController = require('../controllers/game')

const isLoggedIn = require('../middleware/is-loggedIn');

router.get("/", playersController.getIndexs);

router.get("/join-game", isLoggedIn, playersController.getJoinGame);

router.post("/join-game", isLoggedIn, playersController.postJoinGame);

router.get("/checkout", isLoggedIn, playersController.getCheckout);

router.get('/checkout/success', isLoggedIn, playersController.getCheckoutSuccess);

router.get('/checkout/cancel', isLoggedIn, playersController.getCheckout);

router.post("/cancel", isLoggedIn, playersController.postCancel);

module.exports = router;



