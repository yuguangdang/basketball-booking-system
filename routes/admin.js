const express = require("express");

const router = express.Router();

const adminController = require('../controllers/admin')
const isAdmin = require('../middleware/is-admin');

router.post('/finish-game', isAdmin, adminController.postFinishGame)

router.post('/save-game', isAdmin, adminController.postSaveGame)

module.exports = router;