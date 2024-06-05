const Joi = require("joi");

const userSchema = Joi.object({
  username: Joi.string().min(3).max(30).required().label("Username"),
  name: Joi.string().required().label("Name"),
  email: Joi.string().email().required().label("Email"),
  mobile: Joi.string().required().min(10).label("Mobile"),
  country: Joi.string().required().label("Country"),
  password: Joi.string().required().label("Password"),
  is_create_admin: Joi.boolean().label('Is Create Admin')
});

const userLoginSchema = Joi.object({
  username: Joi.string().min(3).max(30).label("Username"),
  email: Joi.string().email().label("Email"),
  password: Joi.string().required().label("Password"),
}).xor("username", "email");

module.exports = { userSchema, userLoginSchema };
