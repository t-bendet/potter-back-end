const express = require("express");
require("./db/mongoose");
const userRouter = require("./routers/user");
const storyRouter = require("./routers/story");
//TODO install cors
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(userRouter);
app.use(storyRouter);

app.listen(port, () => {
  console.log("Server is up on port " + port);
});

// const main = async () => {
//   const user = await User.findById("608fef5ea4bcd81cec40c81d");
//   await user.populate("stories").execPopulate();
//   console.log(user.stories);
// };

// main();
