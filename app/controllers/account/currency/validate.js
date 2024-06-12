const Joi = require("joi");

const currencySchema = Joi.object({
  admin_id: Joi.string().required().label("Admin Id"),
  name: Joi.string().required().label("Name"),
  short_name: Joi.string().required().label("Short Name"),
  symbol: Joi.string().required().label("Symbol"),
});

module.exports = { currencySchema };
