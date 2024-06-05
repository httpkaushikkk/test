const mongoose = require("mongoose");

const permissionSchema = new mongoose.Schema({
  action_name: { type: String },
  name: { type: String },
});

const management = new mongoose.Schema({
  creater: { type: String },
  updater: { type: String },
});

const moduleSchema = new mongoose.Schema(
  {
    module_name: { type: String },
    module_path: { type: String },
    is_active: { type: Boolean, default: true },
    permissions: [permissionSchema],
    management: management,
  },
  {
    timestamps: true,
  }
);

const Module = mongoose.model("Module", moduleSchema);
module.exports = Module;
