const Joi = require("joi");

const adminSchema = Joi.object({
  name: Joi.string().required().label("Name"),
  email: Joi.string().email().required().label("Email"),
  mobile: Joi.string().required().label("Mobile"),
  password: Joi.string().required().label("password"),
  permissions: Joi.array().label('Permission')
});

const adminLoginSchema = Joi.object({
  email: Joi.string().email().required().label("Email"),
  password: Joi.string().required().label("Password"),
});

module.exports = { adminSchema, adminLoginSchema };
