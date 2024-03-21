const express = require("express");
const router = express.Router();
const Joi = require("joi");
const validateRequest = require("../_middleware/validate.request");
const authorize = require("../_middleware/authorize");
const userService = require("./user.service");

// routes
router.post("/authenticate", authenticateSchema, authenticate);
router.post("/register", registerSchema, register);
router.get("/", getAll);
router.get("/:id", getById);
router.put("/:id", updateSchema, update);

module.exports = router;

//login the user
function authenticateSchema(req, res, next) {
  const schema = Joi.object({
    email: Joi.string().email(),
    password: Joi.string().optional(),
  });
  validateRequest(req, next, schema);
}

function authenticate(req, res, next) {
  if (!req.body.password) {
    userService
      .authenticateWithoutPassword(req.body)
      .then((user) => res.json(user))
      .catch(next);
  } else {
    userService
      .authenticate(req.body)
      .then((user) => res.json(user))
      .catch(next);
  }
}

//register the super admin
function registerSchema(req, res, next) {
  const schema = Joi.object({
    userName: Joi.string().required(),
    email: Joi.string().email(),
    password: Joi.string(),
    height: Joi.number(),
    weight: Joi.number(),
    age: Joi.number(),
    gender: Joi.string(),
  });
  validateRequest(req, next, schema);
}

function register(req, res, next) {
  const { userName, email, password, height, weight, age, gender } = req.body;
  const userParams = {
    userName,
    email,
    password,
    height,
    weight,
    age,
    gender
  };

  userService
    .create(userParams)
    .then((result) => {
      // 'result' will contain 'user' details and 'token'
      const { user, token } = result;
      res.json({
        errorMessage: false,
        message: "Successfully registered",
        user,
        token, // Sending the generated token in the response
      });
    })
    .catch((error) => {
      console.error("Error occurred during registration:", error);
      res.status(500).json({ errorMessage: true, message: error });
    });
}

//get all super users
function getAll(req, res, next) {
  userService
    .getAll()
    .then((users) => res.json(users))
    .catch(next);
}

//get the user by id
function getById(req, res, next) {
  userService
    .getById(req.params.id)
    .then((user) => res.json(user))
    .catch(next);
}

//update the user
function updateSchema(req, res, next) {
  const schema = Joi.object({
    userName: Joi.string(),
    email: Joi.string().email(),
    password: Joi.string(),
    height: Joi.number(),
    weight: Joi.number(),
    age: Joi.number(),
    gender: Joi.string(),
  });
  validateRequest(req, next, schema);
}

function update(req, res, next) {
  const { userName, email, password, height, weight, age, gender } = req.body;
  const userParams = {
    userName,
    email,
    password,
    height,
    weight,
    age,
    gender,
  };
  userService
    .update(req.params.id, userParams)
    .then(() => res.json({ message: "Member updated successfully" }))
    .catch(next);
}
