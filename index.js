const cache = require("memory-cache");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const app = require("./app");
const track_apicall = require("./app/middleware/track_apicall");

dotenv.config({
  path: "./config.env",
});

// Middleware to track API call count
// app.use((req, res, next) => {
//   track_apicall(req, res, next);
// });

mongoose.set("strictQuery", false);
mongoose
  .connect(process.env.DB)
  .then(() => {
    console.log("Db connected");
  })
  .catch((e) => {
    console.log(e, "Failed to connect Db");
  });

app.listen(process.env.PORT || 6000, () => {
  console.log(`Server started ${process.env.PORT || 6000}`);
});
