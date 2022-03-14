const express = require("express");
const { body } = require("express-validator");

const router = express.Router();

const authController = require("../controllers/auth");

const isLoggedIn = require('../middleware/is-loggedIn');

router.get("/login", authController.getLogin);

router.post("/login", authController.postLogin);

router.post("/logout", authController.postLogout);

router.get("/signup", authController.getSignup);

router.post(
  "/signup",
  [
    body("name").trim().not().isEmpty().withMessage("Please enter a name."),
    body("email")
      .trim()
      .isEmail()
      .withMessage("Please enter a valid email.")
      .normalizeEmail(),
    body("password")
      .trim()
      .isLength({ min: 5 })
      .withMessage("Please enter a password that has at least 5 characters."),
    body("confirmPassword")
      .trim()
      .custom((value, { req }) => {
        if (value !== req.body.password) {
          throw new Error("Passwords have to match!");
        }
        return true;
      }),
  ],
  authController.postSignup
);

router.get("/reset", authController.getReset);

router.post("/reset", authController.postReset);

router.get("/reset/:token", authController.getNewPassword);

router.post(
  "/new-password",
  body("password")
    .trim()
    .isLength({ min: 5 })
    .withMessage("Please enter a password that has at least 5 characters."),
  authController.postNewPassword
);

router.get("/my-account", isLoggedIn, authController.getMyAccount);

module.exports = router;
