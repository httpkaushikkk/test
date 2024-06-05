const Joi = require("joi");

const walletSchema = Joi.object({
  user_id: Joi.string().required().label("User Id"),
  balance: Joi.number().required().label("Balance"),
});

module.exports = { walletSchema };
