require("dotenv").config();

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const userController = require("./controllers/user.controller");
const driverlogController = require("./controllers/driverlog.controller")

const PORT = process.env.PORT;
mongoose.connect("mongodb://127.0.0.1:27017/driverlog-db");
const db = mongoose.connection

db.once("open", ()=> console.log("Connected to the DB"));
app.use(cors());
app.use(express.json());
app.use("/user", userController);
app.use("/log", driverlogController);

app.listen(PORT, () => {
  console.log(`server is running on port: ${PORT}`);
});

