const Workout = require("./workout.model");
const ModelName = Workout;

//create a new workout
exports.create = (req, res) => {
  try {
    if (!req.body) {
      res.status(400).send({
        message: "Content can not be empty!",
      });
    }

    //create
    const workout = new Workout({
      userId: req.body.userId,
      activity: req.body.activity,
      date: req.body.date,
      duration: req.body.duration,
      distance: req.body.distance,
      calories: req.body.calories,
    });

    //save in database
    ModelName.create(workout, (err, data) => {
      if (err) {
        res.status(500).send({
          message:
            err.message || "Some error occurred while creating the workout.",
        });
      }
      res.send(data);
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

//get datas from workouts table
exports.getAll = (req, res) => {
  try {
    ModelName.getAll((err, data) => {
      if (err) {
        res.status(500).send({
          message:
            err.message || "Some error occurred while retrieving stocks.",
        });
      }
      res.send(data);
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

//get workout by user id
exports.getByUserId = (req, res) => {
  try {
    ModelName.getByUserId(req.params.id, (err, data) => {
      if (err) {
        res.status(500).send({
          message:
            err.message || "Some error occurred while retrieving histories.",
        });
      }
      res.send(data);
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Find a single workout with a workoutId
exports.findOne = (req, res) => {
  try {
    ModelName.findById(req.params.id, (err, data) => {
      if (err) {
        if (err.kind === "not_found") {
          res.status(404).send({
            message: `Not found workout with id ${req.params.id}.`,
          });
        } else {
          res.status(500).send({
            message: "Error retrieving workout with id " + req.params.id,
          });
        }
      } else res.send(data);
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Update a workout identified by the workoutId in the workout
exports.update = (req, res) => {
  try {
    // Validate workout
    if (!req.body) {
      res.status(400).send({
        message: "Content can not be empty!",
      });
    }

    ModelName.updateById(
      req.params.id,
      new ModelName({
        userId: req.body.userId,
        activity: req.body.activity,
        date: req.body.date,
        duration: req.body.duration,
        distance: req.body.distance,
        calories: req.body.calories,
      }),
      (err, data) => {
        if (err) {
          if (err.kind === "not_found") {
            res.status(404).send({
              message: `Not found workout with id ${req.params.id}.`,
            });
          } else {
            res.status(500).send({
              message: "Error updating workout with id " + req.params.id,
            });
          }
        } else res.send({ message: true, data });
      }
    );
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Delete a workout with the specified workoutId in the workout
exports.delete = (req, res) => {
  try {
    ModelName.remove(req.params.id, (err, data) => {
      if (err) {
        if (err.kind === "not_found") {
          res.status(404).send({
            message: `Not found workout with id ${req.params.id}.`,
          });
        } else {
          res.status(500).send({
            message: "Could not delete workout with id " + req.params.id,
          });
        }
      } else res.send({ message: `workout was deleted successfully!` });
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
};
