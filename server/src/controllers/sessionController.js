const Jwt = require('jsonwebtoken');
require('dotenv').config();

const verifyJWT = (token) => {
  return Jwt.verify(token, process.env.JWT_SECRET_KEY);
};

const sessionController = {};
// NEEDS REFACTORING OF SESSION CONTROLLER AND LOGGED IN STATUS.
sessionController.isLoggedIn = async (req, res, next) => {
  try {
    const isValidJWT = verifyJWT(req.cookies.JWT);
    if (!isValidJWT) res.status(401).json({ message: 'Invalid JWT' }); // This code will bug and always return a status of 300 but for now is unused

    return res.json({ message: 'Successful Login' });
  } catch (error) {
    return next({
      log: 'error running sessionController.isLoggedIn middleware.',
      status: 401,
      message: { err: error },
    });
  }
};

module.exports = sessionController;
