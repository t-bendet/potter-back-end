const express = require("express");
const Blog = require("../models/Blog");
const router = new express.Router();

router.post("/blogs", async (req, res) => {
  const blog = new Blog(req.body);
  try {
    await blog.save();
    res.status(201).send(blog);
  } catch (e) {
    res.status(400).send(e.message);
  }
});

module.exports = router;
