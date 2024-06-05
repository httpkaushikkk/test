const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: "dto7ey6g5",
  api_key: "448183457125271",
  api_secret: "_0mbXJQ0_cqecr8X_KgEYm-c0k0",
});

const allowedMimeTypes = ["image/png", "image/gif", "image/jpeg", "image/jpg"];

exports.uploads = (file, folder, mediaType) => {
  let folderPath = "";
  if (mediaType === "game") {
    if (allowedMimeTypes.includes(file.mimetype)) {
      folderPath = `games/${folder}/assets`;
    } else {
      folderPath = `games/${folder}`;
    }
  } else if (mediaType == "profile") {
    folderPath = `profiles/`;
  } else if (mediaType == "game_image") {
    folderPath = `games_images/`;
  } else if (mediaType == "game_icon") {
    folderPath = `games_icon/`;
  }

  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(
      file.path,
      {
        use_filename: true,
        unique_filename: false,
        resource_type: "auto",
        folder: folderPath,
      },
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve({
            url: result.url,
            id: result.public_id,
          });
        }
      }
    );
  });
};
