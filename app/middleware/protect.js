const jwt = require("jsonwebtoken");

const verifyToken = (token, res) => {
  try {
    return jwt.verify(token, process.env.JWT_LOGIN_TOKEN);
  } catch (error) {
    return res.status(401).json({ error: "Authentication failed" });
  }
};

module.exports = async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  if (!token) {
    res.status(401).json({ error: "Unauthorized" });
  }
  const decodedToken = await verifyToken(token, res);
  if (!decodedToken) {
    return res.status(401).json({ error: "Unauthorized - Invalid token" });
  }

  req.user = decodedToken;
  next();
};
