const express = require("express");
const Drawing = require("../models/Drawing");
const router = new express.Router();

router.post("/Drawings", async (req, res) => {
  const drawing = new Drawing(req.body);
  try {
    await drawing.save();
    res.status(201).send(drawing);
  } catch (e) {
    res.status(400).send(e.message);
  }
});

module.exports = router;
