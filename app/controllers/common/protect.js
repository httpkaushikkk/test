const Joi = require("joi");

const fileSchema = Joi.object({
  _id: Joi.string().required().label("id"),
  filename: Joi.string().required().label("Filename"),
  originalName: Joi.string().required().label("OriginalName"),
  mimeType: Joi.string().required().label("MimeType"),
  path: Joi.string().required().label("path"),
});

module.exports = { fileSchema };
