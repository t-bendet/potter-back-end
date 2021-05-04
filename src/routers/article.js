const express = require("express");
const Article = require("../models/Article");
const auth = require("../middleware/auth");
const router = new express.Router();

router.post("/articles", auth, async (req, res) => {
  const article = new Article({
    ...req.body,
    owner: req.user._id,
  });
  try {
    await article.save();
    res.status(201).send(article);
  } catch (e) {
    res.status(400).send(e.message);
  }
});

router.get("/articles/:id", auth, async (req, res) => {
  const _id = req.params.id;

  try {
    const articles = await Article.findOne({ _id, owner: req.user._id });

    if (!articles) {
      return res.status(404).send();
    }

    res.send(articles);
  } catch (e) {
    res.status(500).send();
  }
});

router.get("/articles", auth, async (req, res) => {
  try {
    await req.user.populate("articles").execPopulate();
    res.send(req.user.articles);
  } catch (e) {
    res.status(500).send();
  }
});

router.patch("/articles/:id", auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ["title", "body"];
  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  );

  if (!isValidOperation) {
    return res.status(400).send({ error: "Invalid updates!" });
  }

  try {
    const article = await Article.findOne({
      _id: req.params.id,
      owner: req.user._id,
    });

    if (!article) {
      return res.status(404).send();
    }

    updates.forEach((update) => (article[update] = req.body[update]));
    await article.save();
    res.send(article);
  } catch (e) {
    res.status(400).send(e);
  }
});

router.delete("/articles/:id", auth, async (req, res) => {
  try {
    const article = await Article.findOneAndDelete({
      _id: req.params.id,
      owner: req.user._id,
    });

    if (!article) {
      res.status(404).send();
    }

    res.send(article);
  } catch (e) {
    res.status(500).send();
  }
});

module.exports = router;
