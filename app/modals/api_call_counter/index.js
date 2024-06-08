const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const apiCallSchema = new Schema({
  url_id: { type: String, required: true },
  url: { type: String, required: true },
  count: { type: Number, default: 0 },
});

const ApiCall = mongoose.model("ApiCall", apiCallSchema);
module.exports = ApiCall;
