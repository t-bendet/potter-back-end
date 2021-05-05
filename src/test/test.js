// *****filter example******
router.get("/articles/filter", auth, async (req, res) => {
  const match = {};
  if (req.query.approved) {
    (match.approved = req.query.approved) === "true";
  }
  console.log(match);
  try {
    await req.user.populate({ path: "articles", match }).execPopulate();
    res.send(req.user.articles);
  } catch (e) {
    res.status(500).send();
  }
});
// ***********

// *****pagination example******
router.get("/articles/filter", auth, async (req, res) => {
  const match = {};
  if (req.query.approved) {
    (match.approved = req.query.approved) === "true";
  }
  console.log(match);
  try {
    await req.user
      .populate({
        path: "articles",
        match,
        options: {
          limit: 2,
          skip: 4,
        },
      })
      .execPopulate();
    res.send(req.user.articles);
  } catch (e) {
    res.status(500).send();
  }
});
// ***********sorting examples**********
router.get("/tasks", auth, async (req, res) => {
  const match = {};
  const sort = {};

  if (req.query.completed) {
    match.completed = req.query.completed === "true";
  }

  if (req.query.sortBy) {
    const parts = req.query.sortBy.split(":");
    sort[parts[0]] = parts[1] === "desc" ? -1 : 1;
  }

  try {
    await req.user
      .populate({
        path: "tasks",
        match,
        options: {
          limit: parseInt(req.query.limit),
          skip: parseInt(req.query.skip),
          sort,
        },
      })
      .execPopulate();
    res.send(req.user.tasks);
  } catch (e) {
    res.status(500).send();
  }
});

// ***************** img upload example*******************
const User = require("../models/User");
const sharp = require("sharp");
const multer = require("multer");
const upload = multer({
  limits: {
    // in bytes (1mb)
    fileSize: 1000000,
  },
  // regex to find if file has an image file name ending
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      return cb(new Error("file must be img file"));
    }
    cb(undefined, true);
  },
});

//TODO add try catch?
router.post(
  "/upload",
  auth,
  // single name needs to match to the form-data key name

  upload.single("imageFile"),
  async (req, res) => {
    // sharp to convert to standardize size(250*250) and format(png)
    const buffer = await sharp(req.file.buffer)
      .resize({ width: 250, height: 250 })
      .png()
      .toBuffer();
    //set user imageFile attr to buffer
    req.user.imageFile = buffer;
    await req.user.save();
    res.send(req.user);
  },
  (err, req, res, next) => {
    //add a conditional if err.code send err.code ,else send err.message
    res.status(400).send({ error: err.message });
  }
);

// get a user avatar to show on screen with a get request
router.get("/upload/:id/imageFile", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user || !user.imageFile) {
      throw new Error("errrr");
    }
    // default content type header is Json in express,reconfigure to image
    res.set("Content-Type", "image/png");
    res.send(user.imageFile);
  } catch {
    res, status(404).send();
  }
});
// available at
// http://localhost:3000/upload/609246079b3fc12ba47f0e10/imageFile
