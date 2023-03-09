const Jwt = require('jsonwebtoken');
require('dotenv').config();

const cookieController = {};

cookieController.setJWTCookie = async (req, res, next) => {
  try {
    const createJWT = (email) => {
      const token = Jwt.sign(
        {
          email: email,
        },
        process.env.JWT_SECRET_KEY
      );
      return token;
    };

    const { email } = req.body;

    const jwtToken = createJWT(email);

    res.locals.JWT = jwtToken;
    res.cookie('JWT', jwtToken, {
      httpOnly: true,
    });
    res.cookie('userID', res.locals.userID, {
      httpOnly: true,
    });
    console.log(`Creating JWT for user: ${email}`);
    return next();
  } catch (error) {
    return next({
      log: 'error running cookieController.setJWTCookie middleware.',
      status: 400,
      message: { err: error },
    });
  }
};

module.exports = cookieController;
