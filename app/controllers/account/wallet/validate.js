const Joi = require("joi");

const walletSchema = Joi.object({
  user: Joi.string().required().label("User Id"),
});

module.exports = { walletSchema };
