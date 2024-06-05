const Joi = require("joi");

const permissionsSchema = Joi.object({
  action_name: Joi.string().required().label("Action Name"),
  name: Joi.string().required().label("Name"),
  is_active: Joi.boolean().valid(true, false).default(true).label("Status"),
});

const moduleSchema = Joi.object({
  admin_id: Joi.string().required().label("Id"),
  module_name: Joi.string().required().label("Module Name"),
  module_path: Joi.string().required().label("Module Path"),
  is_active: Joi.boolean().valid(true, false).default(true).label("Status"),
  permissions: Joi.array()
    .items(permissionsSchema)
    .required()
    .label("Permissions"),
});

module.exports = { moduleSchema };
