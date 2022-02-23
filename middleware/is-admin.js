const constants = require('../lib/constants');

module.exports = (req, res, next) => {
  console.log(req.session.player);
  if (req.session.player.email.toString() !== constants.ADMIN_EMAIL) {
    return res.redirect("/login");
  }
  next();
};
