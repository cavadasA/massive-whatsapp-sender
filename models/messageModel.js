const mongoose = require("mongoose");

const Message = new mongoose.Schema(
  {
    title: { type: String, required: true },
    message: { type: String, required: true },
    email: { type: String, required: true},
  },
  { collection: "Messages" }
);

const model = mongoose.model("Messages", Message);

module.exports = model;