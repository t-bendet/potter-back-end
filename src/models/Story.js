const mongoose = require("mongoose");

const storySchema = new mongoose.Schema(
  {
    // owner:{

    // },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    body: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Story = mongoose.model("Story", storySchema);

module.exports = Story;
