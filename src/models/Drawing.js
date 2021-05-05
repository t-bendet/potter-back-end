const mongoose = require("mongoose");

const drawingSchema = new mongoose.Schema(
  {
    imageFile: {
      type: Buffer,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Drawing = mongoose.model("Drawing", drawingSchema);

module.exports = Drawing;
