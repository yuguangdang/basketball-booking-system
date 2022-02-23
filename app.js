const path = require("path");
const fs = require("fs");
const https = require("https");

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoDbStore = require("connect-mongodb-session")(session);
const getDate = require("./util/getDate");
const flash = require("connect-flash");
const constants = require("./lib/constants");
const helmet = require("helmet");
const compression = require("compression");
const morgan = require("morgan");

const MONGODB_URI = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster1.sjjwh.mongodb.net/${process.env.MONGO_DEFAULT_DATABASE}`;
const Game = require("./models/game");

// const privateKey = fs.readFileSync("server.key");
// const certificate = fs.readFileSync("server.cert");

const app = express();
const store = new MongoDbStore({
  uri: MONGODB_URI,
  collection: "sessions",
});

app.set("view engine", "ejs");

const gameRoutes = require("./routes/game.js");
const adminRoutes = require("./routes/admin.js");
const authRoutes = require("./routes/auth.js");

const accessLogStream = fs.createWriteStream(
  path.join(__dirname, "access.log"),
  { flags: "a" }
);

app.use(helmet());
app.use(compression());
app.use(morgan("combined", { stream: accessLogStream }));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));
app.use(
  session({
    secret: "my secret",
    resave: false,
    saveUninitialized: false,
    store: store,
  })
);

app.use(flash());

app.use((req, res, next) => {
  Game.findOne({
    isSaved: false,
  })
    .then((game) => {
      if (game) {
        req.game = game;
      } else {
        game = new Game({
          date: getDate(),
          players: [],
          fee: constants.COURT_FEE,
          isFinished: false,
          isSaved: false,
        });
        game.save();
        req.game = game;
      }
      next();
    })
    .catch((err) => console.log(err));
});

app.use(authRoutes);
app.use(gameRoutes);
app.use(adminRoutes);

app.use((req, res, next) => {
  res
    .status(404)
    .render("404", { path: "wrong path", pageTitle: "Page Not Found" });
});

mongoose
  .connect(MONGODB_URI)
  .then((result) => {
    console.log("MongoDb connected");
  })
  .then((result) => {
    app.listen(process.env.PORT || 3000);
  })
  .catch((err) => {
    console.log(err);
  });
