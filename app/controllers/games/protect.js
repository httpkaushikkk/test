const Joi = require("joi");

const imageSchema = Joi.object({
  name: Joi.string().required(),
  path: Joi.string().required(),
  size: Joi.number().required(),
  mimetype: Joi.string().required(),
  destination: Joi.string().required(),
});

const gameSchema = Joi.object({
  _id: Joi.string().required().label("_id"),
  name: Joi.string().required().label("Name"),
  title: Joi.string().required().label("Title"),
  description: Joi.string().required().label("Description"),
  game_url: Joi.string().required().label("Game Url"),
  // images: Joi.array().items(imageSchema).min(1).label("Images"),
});

module.exports = { gameSchema };
