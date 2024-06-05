const multer = require("multer");
const path = require("path");
const fs = require("fs");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const { mediaType, folder } = req.body;
    if (mediaType == "game") {
      const allowedMimeTypes = [
        "image/png",
        "image/gif",
        "image/jpeg",
        "image/jpg",
      ];
      let uploadPath;
      if (allowedMimeTypes.includes(file.mimetype)) {
        uploadPath = `uploads/games/${folder}/assets`;
        fs.mkdirSync(uploadPath, { recursive: true });
        cb(null, uploadPath);
      } else {
        uploadPath = `uploads/games/${folder}`;
        fs.mkdirSync(uploadPath, { recursive: true });
        cb(null, uploadPath);
      }
    } else if (mediaType == "profile") {
      uploadPath = `uploads/profiles/`;
      fs.mkdirSync(uploadPath, { recursive: true });
      cb(null, uploadPath);
    } else if (mediaType == "game_image") {
      uploadPath = `uploads/games_images/`;
      fs.mkdirSync(uploadPath, { recursive: true });
      cb(null, uploadPath);
    } else if (mediaType == "game_icon") {
      uploadPath = `uploads/games_icon/`;
      fs.mkdirSync(uploadPath, { recursive: true });
      cb(null, uploadPath);
    }
  },
  filename: function (req, file, cb) {
    const { mediaType } = req.body;
    if (mediaType == "game") {
      cb(null, file.originalname);
    } else if (mediaType == "profile") {
      cb(
        null,
        file.fieldname + "-" + Date.now() + path.extname(file.originalname)
      );
    } else if (mediaType == "game_image") {
      cb(
        null,
        file.fieldname + "-" + Date.now() + path.extname(file.originalname)
      );
    } else if (mediaType == "game_icon") {
      cb(
        null,
        file.fieldname + "-" + Date.now() + path.extname(file.originalname)
      );
    }
  },
});

module.exports = multer({ storage: storage });
