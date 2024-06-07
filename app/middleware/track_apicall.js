module.exports = async (req, res, next) => {
  const key = `apiCallCount:${req.path}`;
  let count = cache.get(key) || 0;
  count += 1;
  cache.put(key, count);
  console.log(`API call count for ${req.path}: ${count}`);
  res.locals.apiCallCount = count;
  next();
};
