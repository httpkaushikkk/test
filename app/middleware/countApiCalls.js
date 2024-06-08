const ApiCall = require("../modals/api_call_counter/index");

const countApiCalls = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: "API ID is required" });
    }
    let apiCall = await ApiCall.findOne({ url_id: id });
    if (!apiCall) {
      apiCall = new ApiCall({ url_id: id });
    }
    apiCall.count += 1;
    await apiCall.save();
    next();
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = countApiCalls;