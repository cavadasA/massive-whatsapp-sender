require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const Message = require("./models/messageModel");
const PhoneList = require("./models/phonesModel");

/* SERVER AND DB CONNECTION SETUP */
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const CONNECTION_URL = process.env.MONGODB_URI;
const PORT = process.env.PORT || 5000;
const CLIENT_URL = process.env.CLIENT_URL;

mongoose
  .connect(CONNECTION_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() =>
    app.listen(PORT, () => console.log(`Server running on port: ${PORT}`))
  )
  .catch((error) => console.log(error.message));

if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));
}

/* API ROUTES */

app.post("/api/newMessage", async (req, res) => {
  try {
    if (!req.body.title || !req.body.message || !req.body.email) {
      return res.status(400).json({ msg: "Debes llenar todos los campos" });
    }

    const newMessage = await Message.create({
      title: req.body.title,
      message: req.body.message,
      email: req.body.email,
    });

    return res.json({ status: "New Message created" });
  } catch (error) {
    res.json({ status: "error", error: error });
  }
});
app.post("/api/newPhoneList", async (req, res) => {
  try {
    if (!req.body.title || !req.body.phoneList || !req.body.email) {
      return res.status(400).json({ msg: "Debes llenar todos los campos" });
    }

    const newPhoneList = await PhoneList.create({
      title: req.body.title,
      phoneList: req.body.phoneList,
      email: req.body.email,
    });

    return res.json({ status: "New phone list created" });
  } catch (error) {
    res.json({ status: "error", error: error });
  }
});
app.post("/api/getMessages", async (req, res) => {
  const messages = await Message.find({ email: req.body.email });
  return res.json({ messages });
});
app.post("/api/getPhoneLists", async (req, res) => {
  const phoneLists = await PhoneList.find({ email: req.body.email });
  return res.json({ phoneLists });
});
app.post("/api/updateMessage", async (req, res) => {
  const filter = { _id: req.body.id };
  const updateDoc = {
    $set: {
      title: req.body.title,
      message: req.body.message,
    },
  };
  try {
    await Message.updateOne(filter, updateDoc);
    return res.json({ status: "Update success" });
  } catch (error) {
    return res.json({ status: "Update failed" });
  }
});
app.post("/api/updatePhoneList", async (req, res) => {
  const filter = { _id: req.body.id };
  const updateDoc = {
    $set: {
      title: req.body.title,
      phoneList: req.body.phoneList,
    },
  };
  try {
    await PhoneList.updateOne(filter, updateDoc);
    return res.json({ status: "Update success" });
  } catch (error) {
    return res.json({ status: "Update failed" });
  }
});
app.post("/api/deleteMessage", async (req, res) => {
  const query = { _id: req.body.id };
  try {
    await Message.deleteOne(query);
    return res.json({ status: "Delete success" });
  } catch (error) {
    return res.json({ status: "Delete failed" });
  }
});
app.post("/api/deletePhoneList", async (req, res) => {
  const query = { _id: req.body.id };
  try {
    await PhoneList.deleteOne(query);
    return res.json({ status: "Delete success" });
  } catch (error) {
    return res.json({ status: "Delete failed" });
  }
});

/*app.post("/api/login", async (req, res) => {
  const user = await User.findOne({
    email: req.body.email,
    password: req.body.password,
  });
  if (user) {
    const token = jwt.sign(
      {
        name: user.name,
        email: user.email,
      },
      process.env.ACTIVATION_TOKEN_SECRET
    );

    return res.json({ status: "login success", user: token });
  } else {
    return res.json({ status: "login failed", user: "false" });
  }
});
app.get("/api/quote", async (req, res) => {
  /* TO-DO: CAMBIAR NOMBRE DE LA RUTA DEL API
  const token = req.headers["x-access-token"];

  try {
    const decoded = jwt.verify(token, process.env.ACTIVATION_TOKEN_SECRET);
    const email = decoded.email;
    const user = await User.findOne({
      email: email,
    });
    return res.json({ status: "ok", name: user.name, email: user.email });
  } catch (error) {
    console.log(error);
  }
});*/
