const Admin = require("../../modals/authenticator/admin");
const asyncHandler = require("express-async-handler");
const Files = require("../../modals/game/files");
const cloudinary = require("../../utils/cloudinary");
const fs = require("fs");

// upload game file
exports.uploadGameFile = asyncHandler(async (req, res, next) => {
  const { _id, folder, mediaType } = req.body;
  const check = await Admin.findOne({ _id });
  if (!check)
    return res.status(400).json({ status: 0, message: "User not found!" });

  const uploader = async (file) =>
    await cloudinary.uploads(file, folder, mediaType);

  let urls = [];
  const files = req.files;
  for (const file of files) {
    const { path, mimetype } = file;
    const newPath = await uploader(file);
    urls.push(newPath);
    fs.unlinkSync(path);
  }
  try {
    let files;
    if (mediaType == "game_image") {
      files = req.files.map((file, index) => ({
        name: file.originalname,
        size: file.size,
        path: urls[index].url,
        mimetype: file.mimetype,
        destination: file.destination,
      }));
    } else {
      files = req.files.map((file) => ({
        name: file.originalname,
        size: file.size,
        path: file.path,
        mimetype: file.mimetype,
        destination: file.destination,
      }));
    }
    await Files.create(files);
    res.status(200).json({ status: 1, message: "upload suceess." });
  } catch (err) {
    res.status(500).json({ status: 0, error: err.message });
  }
});

// upload game's posters
exports.uploadGameIcon = asyncHandler(async (req, res, next) => {
  const { _id, folder, mediaType } = req.body;
  const check = await Admin.findOne({ _id });
  if (!check)
    return res.status(400).json({ status: 0, message: "User not found!" });

  const uploader = async (file) =>
    await cloudinary.uploads(file, folder, mediaType);

  const newPath = await uploader(req.file);
  fs.unlinkSync(req.file.path);

  try {
    const file = {
      name: req.file.originalname,
      path: newPath.url,
      size: req.file.size,
      mimetype: req.file.mimetype,
      destination: req.file.destination,
    };
    await Files.create(file);
    res.status(200).json({ status: 1, message: "upload suceess." });
  } catch (err) {
    res.status(500).json({ status: 0, error: err.message });
  }
});
