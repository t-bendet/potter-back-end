const express = require("express");
const Drawing = require("../models/Drawing");
const router = new express.Router();

router.post("/Drawings", async (req, res) => {
  const user = new Drawing(req.body);
  try {
    await user.save();
    res.status(201).send(user);
  } catch (e) {
    res.status(400).send(e.message);
  }
});

module.exports = router;
