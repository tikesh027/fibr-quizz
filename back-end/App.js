const express = require("express");
const Mongoose = require("mongoose");
const uri =
  "mongodb+srv://tikeshsingh2797:quizzApp@cluster0.lk2mj6l.mongodb.net/?retryWrites=true&w=majority";

const userRouter = require("./Routes/AllRoutes");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");

app.use(
  cors({
    "origin": "*",
  "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
  "preflightContinue": false,
  "optionsSuccessStatus": 204,
  })
);

app.use((req, res, next) => {
  console.log("=====>", req.url, req.method);
  next();
});
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(userRouter);

Mongoose.connect(uri)
  .then((res) => {
    console.log("DB Connected");
    app.listen(3001);
  })
  .catch((error) => {
    console.log(error);
  });
