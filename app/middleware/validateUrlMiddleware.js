const unwantedFilePattern =
  /\.(png|jpg|jpeg|gif|mp4|avi|mov|css|txt|html|js)$/i;

const validateUrlMiddleware = (req, res, next) => {

  console.log(req.originalUrl );

  const match = req.url.match(/\/games\/([^/]+)\//);
  const gameName = match ? match[1] : null;
  const restrictedpath = `/uploads/games/${gameName}/index.html`;

  const url = `http://localhost:8100${restrictedpath}`;

  const pathParts = req.url.split("/");
  const lastTwoIds = pathParts.slice(-2);

  if (restrictedpath && lastTwoIds.length != 0) {
    console.log("hello");
    return res.redirect(`http://localhost:8100${restrictedpath}`);
  } else if (url) {
    console.log("error");
  }

  // if (unwantedFilePattern.test(req.url)) {
  //   return res
  //     .status(400)
  //     .json({ error: "Invalid URL: Direct resource access not allowed" });
  // }
  // next();
};

module.exports = validateUrlMiddleware;
