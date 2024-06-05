const mongoose = require("mongoose");

const fileSchema = new mongoose.Schema({
  name: { type: String, required: true },
  path: { type: String, required: true },
  size: { type: String, required: true },
  mimetype: { type: String, required: true },
  destination: { type: String, required: true }
});

const File = mongoose.model("File", fileSchema);
module.exports = File;
