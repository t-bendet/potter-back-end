const express = require("express");
const Story = require("../models/Story");
const router = new express.Router();

router.post("/stories", async (req, res) => {
  const story = new Story(req.body);
  try {
    await story.save();
    res.status(201).send(story);
  } catch (e) {
    res.status(400).send(e.message);
  }
});

module.exports = router;
