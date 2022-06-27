const mongoose = require("mongoose");

const PhoneList = new mongoose.Schema(
  {
    title: { type: String, required: true },
    phoneList: { type: String, required: true },
    email: { type: String, required: true},
  },
  { collection: "Phone Lists" }
);

const model = mongoose.model("Phones", PhoneList);

module.exports = model;