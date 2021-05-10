const mongoose = require("mongoose");
const { MONGOODB_KEY } = require("../config/keys");

const uri = `mongodb+srv://${MONGOODB_KEY}@pottertribute.s7ojt.mongodb.net/potterBackEnd?retryWrites=true&w=majority`;
mongoose
  .connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("MongoDB Connected…");
  })
  .catch((err) => console.log(err));
