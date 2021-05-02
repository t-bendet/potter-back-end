const mongoose = require("mongoose");

const drawingSchema = new mongoose.Schema(
  {
    // owner:{
    // },
    imageFile: {
      type: Buffer,
      // required: true,
    },
    description: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Drawing = mongoose.model("Drawing", drawingSchema);

module.exports = Drawing;
