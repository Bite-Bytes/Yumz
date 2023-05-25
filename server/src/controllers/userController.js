const { query } = require('express');
const db = require('../models/userModels.js');
const bcrypt = require('bcrypt');
const Jwt = require('jsonwebtoken');

// Helper functions to verify JWT token and compare bcrypt passwords
const verifyJWT = (token) => {
  return Jwt.verify(token, process.env.JWT_SECRET_KEY);
};
const comparePassword = async (password, hashed) => {
  return await bcrypt.compare(password, hashed);
};

const userController = {};

// Protects our API route
userController.protect = (req, res, next) => {
  try {
    const isValidJWT = verifyJWT(req.cookies.JWT);
    if (!isValidJWT) res.status(401).json({ message: 'User is not logged in' });

    return next();
  } catch (error) {
    return next({
      log: 'error running userController.protect middleware.',
      status: 400,
      message: { message: error },
    });
  }
};

// Verifies if user password matches
userController.verifyUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    let hashedPassword = await db.query(
      `SELECT email, password, _id FROM users WHERE email = '${email}'`
    );
    res.locals.userID = hashedPassword.rows[0]._id;
    hashedPassword = hashedPassword.rows[0].password;

    const isValidPW = await comparePassword(password, hashedPassword);

    if (!isValidPW) {
      return res.status(401).json({ message: 'Wrong password' });
    }
    return next();
  } catch (error) {
    return next({
      log: 'error running userController.verifyUser middleware.',
      status: 400,
      message: { err: error },
    });
  }
};

// Creates user and also checks if the user exists in DB.
userController.createUser = async (req, res, next) => {
  try {
    console.log('in createUser');
    const { name, email } = req.body;
    let { password } = req.body;

    const checkEmail = await db.query(
      `SELECT email FROM users WHERE email = '${email}'`
    );
    console.log(`Checking if email:${email} exists in DB.`);
    if (checkEmail.rowCount !== 0) {
      return next({
        log: 'email already exists',
        status: 400,
        message: { err: 'email already exists' },
      });
    }

    password = await bcrypt.hash(password, 5);
    console.log(`Creating user for:${name}`);
    await db.query(
      `INSERT INTO users (email, name, password)
      VALUES ('${email}', '${name}', '${password}')`
    );
    //getting that instance from the database and saving it to res.locals
    const queryResult = await db.query(
      `SELECT * FROM users WHERE email = '${email}'`
    );
    res.locals.userID = queryResult.rows[0]._id;

    return next();
  } catch (error) {
    return next({
      log: 'error running userController.createUser middleware',
      status: 400,
      message: { err: error },
    });
  }
};

module.exports = userController;
