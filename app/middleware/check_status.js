module.exports = async (res, status) => {
  if (status) return;
  else return res.status(403).json({ message: "User is not active" });
};
