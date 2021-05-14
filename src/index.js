const express = require("express");
require("./db/mongoose");
const userRouter = require("./routers/user");
const storyRouter = require("./routers/story");
const drawingRoute = require("./routers/drawing");
const articleRoute = require("./routers/article");
const cors = require("cors");

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());
app.use(userRouter);
app.use(storyRouter);
app.use(drawingRoute);
app.use(articleRoute);

app.listen(port, () => {
  console.log("Server is up on port " + port);
});
