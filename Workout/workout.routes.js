var app = require("express").Router();
var Workout = require("./workout.controller");
const subUrl = "workout";

//create new Workout
app.post(`/${subUrl}`, Workout.create);

//get all
app.get(`/${subUrl}`, Workout.getAll);

//get all Workout by userid
app.get(`/${subUrl}/userWorkout/:id`, Workout.getByUserId);

//get by id
app.get(`/${subUrl}/:id`, Workout.findOne);

//update the Workout
app.put(`/${subUrl}/:id`, Workout.update);

//delte the Workout
app.delete(`/${subUrl}/:id`, Workout.delete);

module.exports = app;
