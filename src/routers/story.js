const express = require("express");
const Story = require("../models/Story");
const auth = require("../middleware/auth");
const router = new express.Router();

router.post("/stories", auth, async (req, res) => {
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

module.exports = router;
