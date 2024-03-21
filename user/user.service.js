const config = require("../_helpers/config.json");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const db = require("_helpers/dbUser");
const nodemailer = require("nodemailer");
require("dotenv").config();

module.exports = {
  authenticate,
  authenticateWithoutPassword,
  getAll,
  getById,
  create,
  update,
};

//login the user with password
async function authenticate({ email, password }) {
  const user = await db.User.scope("withHash").findOne({
    where: { email },
  });
  if (!user || !(await bcrypt.compare(password, user.password)))
    throw "Email or Password is incorrect";

  // Authentication successful
  const token = jwt.sign({ sub: user.id }, config.secret, {
    expiresIn: "7d",
  });
  return { ...omitHash(user.get()), token };
}

//login the user without password
async function authenticateWithoutPassword({ email }) {
  const user = await db.User.findOne({
    where: { email },
  });

  if (!user) {
    throw "Email not found";
  }

  // Authentication successful without password check
  const token = jwt.sign({ sub: user.id }, config.secret, {
    expiresIn: "7d",
  });

  return { ...omitHash(user.get()), token };
}

//signup the user
async function create(params) {
  // validate if email is already taken
  const existingUser = await db.User.findOne({
    where: { email: params.email },
  });
  if (existingUser) {
    throw "Email is already taken";
  }

  // Hash password if provided
  if (params.password) {
    params.password = await bcrypt.hash(params.password, 10);
  }

  // Create the user
  const newUser = await db.User.create(params);

  // Generate JWT token
  const token = jwt.sign({ sub: newUser.id }, config.secret, {
    expiresIn: "7d",
  });

  return { user: newUser, token }; // Return user details and token
}

//get all users
async function getAll() {
  return await db.User.findAll({
    order: [["createdAt", "DESC"]],
  });
}

//get the user by id
async function getById(id) {
  return await getUser(id);
}

//update the user
async function update(id, params) {
  const user = await getUser(id);

  //validate
  const emailChanged = params.email && user.email !== params.email;
  if (emailChanged) {
    // If the email has changed, validate uniqueness
    if (await db.User.findOne({ where: { email: params.email } })) {
      throw "Email is already taken";
    }
  }

  //update user
  Object.assign(user, params);
  await user.save();
}

//helper functions
async function getUser(id) {
  const user = await db.User.findByPk(id);
  if (!user) throw "User not found";
  return user;
}

//omit hash function
function omitHash(user) {
  const { password, ...userWithoutHash } = user;
  return userWithoutHash;
}
