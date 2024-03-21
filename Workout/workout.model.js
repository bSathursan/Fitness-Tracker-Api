const sql = require("../_helpers/db");
const tableName = "workouts";

const Workout = function (workout) {
  this.userId = workout.userId;
  this.activity = workout.activity;
  this.date = workout.date;
  this.duration = workout.duration;
  this.distance = workout.distance;
  this.calories = workout.calories;
};

const ModelName = Workout;

//insert the datas in workout table
ModelName.create = (newWorkout, result) => {
  try {
    sql.query(`INSERT INTO ${tableName} SET ?`, newWorkout, (err, res) => {
      if (err) {
        result(err, null);
        return;
      }
      result(null, { id: res.insertId, ...newWorkout });
    });
  } catch (error) {
    console.error(error);
  }
};

//get all datas from table
ModelName.getAll = (result) => {
  try {
    sql.query(
      `SELECT * FROM ${tableName} ORDER BY createdAt DESC`,
      (err, res) => {
        if (err) {
          result(err, null);
          return;
        }
        result(null, res);
      }
    );
  } catch (error) {
    console.log(error);
  }
};

//get workouts by user id
ModelName.getByUserId = (userId, result) => {
  try {
    sql.query(
      `SELECT * FROM ${tableName} WHERE userId = ${userId} ORDER BY createdAt DESC`,
      (err, res) => {
        if (err) {
          result(err, null);
          return;
        }
        result(null, res);
      }
    );
  } catch (error) {
    console.log(error);
  }
};

//get the workout form by id
ModelName.findById = (id, result) => {
  try {
    sql.query(`SELECT * FROM ${tableName} WHERE id = ${id}`, (err, res) => {
      if (err) {
        result(err, null);
        return;
      }

      if (res.length) {
        result(null, res[0]);
        return;
      }

      // not found workout with the id
      result({ kind: "not_found" }, null);
    });
  } catch (error) {
    console.error(error);
  }
};

//update the requests
ModelName.updateById = (id, workout, result) => {
  try {
    this.userId = workout.userId;
    this.activity = workout.activity;
    this.date = workout.date;
    this.duration = workout.duration;
    this.distance = workout.distance;
    this.calories = workout.calories;

    sql.query(
      `UPDATE ${tableName} SET  userId = ?,  activity = ?,  date = ?,  duration = ?,  distance = ?,  calories = ? WHERE id = ${id}`,
      [
        workout.userId,
        workout.activity,
        workout.date,
        workout.duration,
        workout.distance,
        workout.calories,
        id,
      ],
      (err, res) => {
        if (err) {
          result(null, err);
          return;
        }

        if (res.affectedRows == 0) {
          // not found workout with the id
          result({ kind: "not_found" }, null);
          return;
        }
        result(null, { id: id, ...workout });
      }
    );
  } catch (error) {
    console.error(error);
  }
};

//delete the workout form
ModelName.remove = (id, result) => {
  try {
    sql.query(`DELETE FROM ${tableName} WHERE id = ?`, id, (err, res) => {
      if (err) {
        result(null, err);
        return;
      }

      result(null, res);
    });
  } catch (error) {
    console.error(error);
  }
};

module.exports = ModelName;
