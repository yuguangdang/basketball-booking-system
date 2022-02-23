const crypto = require("crypto");

const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const sendgridTransport = require("nodemailer-sendgrid-transport");
const { validationResult } = require("express-validator");

const Player = require("../models/player");
const flash = require("connect-flash/lib/flash");

const constants = require('../lib/constants')

const transporter = nodemailer.createTransport(
  sendgridTransport({
    auth: {
      api_key:
        "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",
    },
  })
);

exports.getLogin = (req, res, next) => {
  let message = req.flash("error");
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render("auth/login", {
    path: "/login",
    pageTitle: "Login",
    isAuthenticated: req.session.isLoggedIn,
    errorMessage: message,
    oldInput: {
      email: '',
      password: ''
    }
  });
};

exports.postLogin = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  Player.findOne({
    email: email,
  }).then((player) => {
    if (!player) {
      req.flash("error", "Invalid email or password.");
      return res.redirect("/login");
    }
    bcrypt
      .compare(password, player.password)
      .then((doMatch) => {
        if (doMatch) {
          req.session.isLoggedIn = true;
          req.session.player = player;
          return req.session.save((err) => {
            console.log(err);
            res.redirect("/");
          });
        }
        req.flash("error", "Invalid email or password.");
        res.render("auth/login", {
          path: "/login",
          pageTitle: "Login",
          isAuthenticated: req.session.isLoggedIn,
          errorMessage: req.flash("error"),
          oldInput: {
            email: email,
            password: password
          }
        });
      })
      .catch((err) => {
        console.log(err);
        res.redirect("/login");
      });
  });
};

exports.postLogout = (req, res, next) => {
  req.session.destroy((err) => {
    res.redirect("/");
    console.log(err);
  });
};

exports.getSignup = (req, res, next) => {
  let message = req.flash("error");
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render("auth/signup", {
    path: "/signup",
    pageTitle: "signup",
    isAuthenticated: req.session.isLoggedIn,
    errorMessage: message,
    oldInput: {
      name: "",
      position: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    validationErrors: [],
  });
};

exports.postSignup = (req, res, next) => {
  const name = req.body.name;
  const position = req.body.position.toUpperCase();
  const email = req.body.email;
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).render("auth/signup", {
      path: "signup",
      pageTitle: "Signup",
      isAuthenticated: req.session.isLoggedIn,
      errorMessage: errors.array()[0].msg,
      oldInput: {
        name: name,
        position: position,
        email: email,
        password: password,
        confirmPassword: confirmPassword,
      },
      validationErrors: errors.array(),
    });
  }

  Player.findOne({ email: email })
    .then((user) => {
      if (user) {
        req.flash(
          "error",
          "It seems you are already registered. Please login."
        );
        return res.redirect("/login");
      }
      return bcrypt
        .hash(password, 12)
        .then((hashedPassword) => {
          const player = new Player({
            name: name,
            email: email,
            password: hashedPassword,
            position: position,
            gameNum: 0
          });
          return player.save();
        })
        .then((result) => {
          transporter.sendMail({
            to: email,
            from: "yuguangdang@qq.com",
            subject: "Colindale Legend sign up succeeded!",
            html: `
            <h1>Hi ${name}:</h1>
            <h2>Well done mate! You are now a member of Colindale Legend!</h2>
            <h2>Looking forward to seeing you on court soon!</h2>
            `,
          });
          req.flash('error', 'You have successfully registered! Please sign in!');
          res.render("auth/login", {
            path: "/login",
            pageTitle: "Login",
            isAuthenticated: req.session.isLoggedIn,
            errorMessage: req.flash("error"),
            oldInput: {
              email: email,
              password: ''
            }
          });
        });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getReset = (req, res, next) => {
  let message = req.flash("error");
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render("auth/reset", {
    path: "/reset",
    pageTitle: "Reset Password",
    errorMessage: message,
    isAuthenticated: req.session.isLoggedIn,
    oldEmail: "",
  });
};

exports.postReset = (req, res, next) => {
  crypto.randomBytes(32, (err, buffer) => {
    if (err) {
      console.log(err);
      return res.redirect("/reset");
    }
    const token = buffer.toString("hex");
    Player.findOne({ email: req.body.email })
      .then((player) => {
        if (!player) {
          req.flash("error", "No account with that email found.");
          return res.status(422).render("auth/reset", {
            path: "/reset",
            pageTitle: "Reset Password",
            errorMessage: req.flash("error"),
            isAuthenticated: req.session.isLoggedIn,
            oldEmail: req.body.email,
          });
        }
        player.resetToken = token;
        player.resetTokenExpiration = Date.now() + 3600000;
        player.save();
      })
      .then((result) => {
        req.flash("error", "Please check your email to reset the password.");
        res.redirect("/login");
        transporter.sendMail({
          to: req.body.email,
          from: "yuguangdang@qq.com",
          subject: "Password Reset - Colindale Legend",
          html: `
        <h1>Hey mate,
        <p>You requested a password reset.</p>
        <p>Click this <a href="https://colindale-basketball-legend.herokuapp.com/reset/${token}">link</a> to set a new password.</P>
        `,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  });
};

exports.getNewPassword = (req, res, next) => {
  const token = req.params.token;
  Player.findOne({
    resetToken: token,
    resetTokenExpirtation: { $gt: Date.now },
  })
    .then((player) => {
      let message = req.flash("error");
      if (message.length > 0) {
        message = message[0];
      } else {
        message = null;
      }
      res.render("auth/new-password", {
        path: "/new-password",
        pageTitle: "New Password",
        isAuthenticated: req.session.isLoggedIn,
        errorMessage: message,
        playerEmail: player.email,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.postNewPassword = (req, res, next) => {
  const newPassword = req.body.password;
  const playerEmail = req.body.playerEmail;
  const errors = validationResult(req);
  let resetPlayer;

  if (!errors.isEmpty()) {
    req.flash('error', 'Please enter a password that has at least 5 characters.');
    return res.render("auth/new-password", {
      path: "/new-password",
      pageTitle: "New Password",
      isAuthenticated: req.session.isLoggedIn,
      errorMessage:  req.flash("error"),
      playerEmail: playerEmail,
    });
  }

  Player.findOne({
    email: playerEmail,
  })
    .then((player) => {
      resetPlayer = player;
      return bcrypt.hash(newPassword, 12);
    })
    .then((hashedPassword) => {
      resetPlayer.password = hashedPassword;
      resetPlayer.resetToken = undefined;
      resetPlayer.resetTokenExpiration = undefined;
      resetPlayer.save();
    })
    .then((result) => {
      req.flash("error", "Now you can login using new password.");
      res.redirect("/login");
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getMyAccount = (req, res, next) => {
  Player.findOne({email: req.session.player.email}).then(player => {
    res.render('auth/my-account', {
      path: "/my-account",
      pageTitle: "My Account",
      player: player,
      isAuthenticated: req.session.isLoggedIn,
      gamesPerStar: constants.GAMES_PER_STAR
    });
  })
  
}