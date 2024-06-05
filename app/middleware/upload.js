const cloudinary = require("../utils/cloudinary");
const path = require("path");

async function uploadFile(req, res, next) {
  const { mediaType, folder } = req.body;

  for (const file in req.files) {
    try {
      const fileName = path.basename(req.files[file].path);
      // check existing file
      // const existingResource = await cloudinary.api.resource(fileName);
      // if (existingResource) {
      //   console.warn("File already exists:", fileName);
      //   break;
      // }
      console.log(fileName);
      // const uploadOptions = {
      //   use_filename: true,
      //   unique_filename: false,
      //   resource_type: "auto",
      // };
      // if (folder) {
      //   if (mediaType == "game") {
      //     uploadOptions.folder = `games/${folder}`;
      //   }
      // }
      // //  uploding files
      // const result = await cloudinary.uploader.upload(
      //   req.files[file].path,
      //   uploadOptions
      // );
      // console.log(result.secure_url);
    } catch (err) {
      console.error("Error uploading file:", err);
    }
  }

  // const uploadPromises = req.files.map(async (file) => {
  //   const fileName = path.basename(file.path);
  //   // check existing file
  //   const existingResource = await cloudinary.api.resource(fileName);
  //   if (existingResource) {
  //     console.warn("File already exists:", fileName);
  //   }
  //   const uploadOptions = {
  //     use_filename: true,
  //     unique_filename: false,
  //     resource_type: "auto",
  //   };
  //   if (folder) {
  //     if (mediaType == "game") {
  //       uploadOptions.folder = `games/${folder}`;
  //     }
  //   }
  //   //  uploding files
  //   const result = await cloudinary.uploader.upload(file.path, uploadOptions);
  //   return result.secure_url;
  // });

  // const uploadedUrls = await Promise.all(uploadPromises);
  // console.log(uploadedUrls);

  // for (let i = 0; i < req.files.length; i++) {
  //   const fileName = path.basename(req.files[i].path);

  //   try {
  //     // check existing file
  //     const existingResource = await cloudinary.api.resource(fileName);
  //     if (existingResource) {
  //       console.warn("File already exists:", fileName);
  //       break;
  //     }

  //     const uploadOptions = {
  //       use_filename: true,
  //       unique_filename: false,
  //       resource_type: "auto",
  //     };
  //     if (folder) {
  //       if (mediaType == "game") {
  //         uploadOptions.folder = `games/${folder}`;
  //       }
  //     }
  //     // uploding files
  //     const result = await cloudinary.uploader.upload(
  //       req.files[i].path,
  //       uploadOptions
  //     );
  //     console.log("File uploaded successfully:", result);
  //   } catch (err) {
  //     console.error("Error uploading file:", err);
  //   }
  // }

  // try {
  //   // check existing file
  //   const existingResource = await cloudinary.api.resources(fileName);
  //   if (existingResource) {
  //     console.warn("File already exists:", fileName);
  //     return;
  //   }

  //   const uploadOptions = {
  //     use_filename: true,
  //     unique_filename: false,
  //     resource_type: "auto",
  //   };
  //   if (folder) {
  //     if (mediaType == "game") {
  //       uploadOptions.folder = `games/${folder}`;
  //     }
  //   }

  //   const result = await cloudinary.uploader.upload(filePath, uploadOptions);
  //   console.log("File uploaded successfully:", result);
  // } catch (err) {
  //   console.error("Error uploading file:", err);
  // }
}

module.exports = uploadFile;
