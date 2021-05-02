const mongoose = require("mongoose");
const validator = require("validator");

const blogSchema = new mongoose.Schema(
  {
    // owner:{

    // },
    posts: [
      {
        title: {
          type: String,
          required: true,
          trim: true,
        },
        body: {
          type: String,
          required: true,
          trim: true,
        },
        createdAt: {
          type: Date,
          default: new Date(),
        },
      },
    ],
  },
  { timestamps: true }
);

const Blog = mongoose.model("Blog", blogSchema);

module.exports = Blog;
