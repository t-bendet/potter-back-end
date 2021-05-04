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
