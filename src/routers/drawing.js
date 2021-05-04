const express = require("express");
const Drawing = require("../models/Drawing");
const auth = require("../middleware/auth");
const router = new express.Router();

router.post("/drawings", auth, async (req, res) => {
  const drawing = new Drawing({
    ...req.body,
    owner: req.user._id,
  });
  try {
    await drawing.save();
    res.status(201).send(drawing);
  } catch (e) {
    res.status(400).send(e.message);
  }
});

router.get("/drawings/:id", auth, async (req, res) => {
  const _id = req.params.id;

  try {
    const drawing = await Drawing.findOne({ _id, owner: req.user._id });

    if (!drawing) {
      return res.status(404).send();
    }

    res.send(drawing);
  } catch (e) {
    res.status(500).send();
  }
});

router.get("/drawings", auth, async (req, res) => {
  try {
    await req.user.populate("drawings").execPopulate();
    res.send(req.user.drawings);
  } catch (e) {
    res.status(500).send();
  }
});

router.patch("/drawings/:id", auth, async (req, res) => {
  const updates = Object.keys(req.body);
  //TODO update img file or not?
  const allowedUpdates = ["description", "title", "imageFile"];
  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  );

  if (!isValidOperation) {
    return res.status(400).send({ error: "Invalid updates!" });
  }

  try {
    const drawing = await Drawing.findOne({
      _id: req.params.id,
      owner: req.user._id,
    });

    if (!drawing) {
      return res.status(404).send();
    }

    updates.forEach((update) => (drawing[update] = req.body[update]));
    await drawing.save();
    res.send(drawing);
  } catch (e) {
    res.status(400).send(e);
  }
});

router.delete("/drawings/:id", auth, async (req, res) => {
  try {
    const drawing = await Drawing.findOneAndDelete({
      _id: req.params.id,
      owner: req.user._id,
    });

    if (!drawing) {
      res.status(404).send();
    }

    res.send(drawing);
  } catch (e) {
    res.status(500).send();
  }
});

const multer = require("multer");
const upload = multer({
  limits: {
    // in bytes (1mb)
    fileSize: 1000000,
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      return cb(new Error("file must be img file"));
    }
    cb(undefined, true);
  },
});

router.post(
  "/upload",
  auth,
  upload.single("imageFile"),
  async (req, res) => {
    req.user.imageFile = req.file.buffer;
    await req.user.save();
    res.send(req.user);
  },
  (err, req, res, next) => {
    //add a conditional if err.code send err.code ,else send err.message
    res.status(400).send({ error: err.message });
  }
);

module.exports = router;

// router.post("/drawings", auth, async (req, res) => {
//   const drawing = new Drawing({
//     ...req.body,
//     owner: req.user._id,
//   });
//   try {
//     await drawing.save();
//     res.status(201).send(drawing);
//   } catch (e) {
//     res.status(400).send(e.message);
//   }
// });
