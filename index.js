const mongoose = require("mongoose");
const dotenv = require("dotenv");
const app = require("./app");

dotenv.config({
  path: "./config.env",
});

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
