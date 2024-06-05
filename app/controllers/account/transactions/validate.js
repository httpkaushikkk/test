const Joi = require("joi");

const transactionSchema = Joi.object({
  wallet_id: Joi.string().required().label("Wallet Id"),
  user_id: Joi.string().required().label("User Id"),
  gateway_payment_id: Joi.string().required().label("Gateway Payment Id"),
  amount: Joi.string().required().label("Amount"),
  currency: Joi.string().required().label("Currency"),
  transaction_type: Joi.string().required().label("Transaction Type"),
});

module.exports = { transactionSchema };
