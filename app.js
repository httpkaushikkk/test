const path = require("path");
const cors = require("cors");
const express = require("express");
const bodyParser = require("body-parser");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const AppError = require("./app/utils/app_error");

const app = express();

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use(cors());

app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(
  session({
    secret: "aswfv5efr44v4as4vs8advsvasfa",
    resave: false,
    saveUninitialized: false,
  })
);

const defultRoutes = "/v1/api/";
// routes
const game = require("./app/routes/games");
const common = require("./app/routes/common");
const moduleRoute = require("./app/routes/module");
const webhook = require("./app/routes/games/webhook");
const walletRoute = require("./app/routes/account/wallet");
const selectGame = require("./app/routes/games/select_game");
const userRoute = require("./app/routes/authenticator/user");
const activeGame = require("./app/routes/games/active_game");
const adminRoute = require("./app/routes/authenticator/admin");
const currencyRoute = require("./app/routes/account/currency");
const transactionRoute = require("./app/routes/account/transactions");

// reports
const gameReport = require("./app/routes/report/game");
const transactionReport = require("./app/routes/report/transaction");

// apis endpoints
app.use(`${defultRoutes}`, webhook);
app.use(`${defultRoutes}game`, game);
app.use(`${defultRoutes}common`, common);
app.use(`${defultRoutes}user`, userRoute);
app.use(`${defultRoutes}game`, selectGame);
app.use(`${defultRoutes}admin`, adminRoute);
app.use(`${defultRoutes}module`, moduleRoute);
app.use(`${defultRoutes}wallet`, walletRoute);
app.use(`${defultRoutes}game/active`, activeGame);
app.use(`${defultRoutes}currency`, currencyRoute);
app.use(`${defultRoutes}transaction`, transactionRoute);

// report
app.use(`${defultRoutes}report/game`, gameReport);
app.use(`${defultRoutes}report/transaction`, transactionReport);

app.all("*", (req, res, next) => {
  next(new AppError(`can't find ${req.originalUrl} on this server`, 404));
});

module.exports = app;