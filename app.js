require("rootpath")();
const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const errorHandler = require("./_middleware/error.handler");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

// LANDIGN PAGE
app.get("/", function (req, res) {
  res.sendFile(__dirname + "/views/index.html");
});

//api routes
app.use("/user", require("./user/user.controller"));
app.use("/", require("./Workout/workout.routes"));

// 404 PAGE - always should be last
app.get("*", function (req, res) {
  res.status(404).sendFile(__dirname + "/views/notfound.html");
});

//global error handler
app.use(errorHandler);

//start server
const port =
  process.env.NODE_ENV === "production" ? process.env.PORT || 80 : 4000;
app.listen(port, () => console.log("Server listening on port " + port));
