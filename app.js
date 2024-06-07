const express = require("express");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const AppError = require("./app/utils/app_error");
const cors = require("cors");
const path = require("path");

const app = express();

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use(cors());

app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

const defultRoutes = "/v1/api/";
// routes
const game = require("./app/routes/games");
const common = require("./app/routes/common");
const moduleRoute = require("./app/routes/module");
const webhook = require("./app/routes/games/webhook");
const selectGame = require("./app/routes/games/select_game");
const userRoute = require("./app/routes/authenticator/user");
const adminRoute = require("./app/routes/authenticator/admin");
const currencyRoute = require("./app/routes/account/currency");

// apis endpoints
app.use(`${defultRoutes}user`, userRoute);
app.use(`${defultRoutes}admin`, adminRoute);
app.use(`${defultRoutes}module`, moduleRoute);
app.use(`${defultRoutes}currency`, currencyRoute);
app.use(`${defultRoutes}common`, common);
app.use(`${defultRoutes}game`, game);
app.use(`${defultRoutes}game`, selectGame);
app.use(`${defultRoutes}`, webhook);


app.all("*", (req, res, next) => {
  next(new AppError(`can't find ${req.originalUrl} on this server`, 404));
});

module.exports = app;
