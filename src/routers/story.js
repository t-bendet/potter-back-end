const express = require("express");
const Story = require("../models/Story");
const auth = require("../middleware/auth");
const router = new express.Router();

router.post("/story", auth, async (req, res) => {
  const story = new Story({
    ...req.body,
    owner: req.user._id,
  });
  try {
    await story.save();
    res.status(201).send(story);
  } catch (e) {
    res.status(400).send(e.message);
  }
});

router.get("/stories/:id", auth, async (req, res) => {
  const _id = req.params.id;

  try {
    const stories = await Story.findOne({ _id, owner: req.user._id });

    if (!stories) {
      return res.status(404).send();
    }

    res.send(stories);
  } catch (e) {
    res.status(500).send();
  }
});

router.get("/stories", auth, async (req, res) => {
  try {
    await req.user.populate("stories").execPopulate();
    res.send(req.user.stories);
  } catch (e) {
    res.status(500).send();
  }
});

router.patch("/stories/:id", auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ["title", "body"];
  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  );

  if (!isValidOperation) {
    return res.status(400).send({ error: "Invalid updates!" });
  }

  try {
    const story = await Story.findOne({
      _id: req.params.id,
      owner: req.user._id,
    });

    if (!story) {
      return res.status(404).send();
    }

    updates.forEach((update) => (story[update] = req.body[update]));
    await story.save();
    res.send(story);
  } catch (e) {
    res.status(400).send(e);
  }
});

router.delete("/stories/:id", auth, async (req, res) => {
  try {
    const story = await Story.findOneAndDelete({
      _id: req.params.id,
      owner: req.user._id,
    });

    if (!story) {
      res.status(404).send();
    }

    res.send(story);
  } catch (e) {
    res.status(500).send();
  }
});

module.exports = router;
