const jwt = require("jsonwebtoken");
module.exports = (options, secret, expireTime) => {
  return jwt.sign(options, secret, {
    expiresIn: expireTime,
  });
};
