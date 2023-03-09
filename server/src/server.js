const express = require('express');
const path = require('path');
const morgan = require('morgan');
const { body, validationResult } = require('express-validator');
const cookieParser = require('cookie-parser');
const userController = require('./controllers/userController');
const restaurantController = require('./controllers/restaurantController');
const collectionsController = require('./controllers/collectionsController');
const cookieController = require('./controllers/cookieController');
const sessionController = require('./controllers/sessionController');

const app = express();
const apiRouter = require('./routes/apiRouter');
const PORT = 3000;

// General middleware
app.use(morgan('dev'));
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

app.use('/api', userController.protect, apiRouter);

app.post(
  '/signup',
  body('email').isEmail().normalizeEmail(),
  body('name').not().isEmpty(),
  body('password').not().isEmpty(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array()[0] });
    else return next();
  },
  userController.createUser,
  cookieController.setJWTCookie
);

app.post(
  '/login',
  body('email').isEmail().normalizeEmail(),
  body('password').not().isEmpty(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ error: errors.array() });
    else return next();
  },
  userController.verifyUser,
  cookieController.setJWTCookie
);

app.post('/addToWishlist', collectionsController.addToWishlist, (req, res) => {
  res.status(200);
  res.send(res.locals);
});

app.post(
  '/addToFavorites',
  collectionsController.addToFavorites,
  (req, res) => {
    res.status(200);
    res.send(res.locals);
  }
);

// addToReviews was empty
app.post('/addToReviews', collectionsController.addToReviews, (req, res) => {
  res.status(200);
  res.send(res.locals.query);
});

// removeFromFavorites
app.post(
  '/removeFromFavorites',
  collectionsController.removeFromFavorites,
  (req, res) => {
    res.status(200);
    res.send(res.locals.query);
  }
);
// removeFromWishlist
app.post(
  '/removeFromWishlist',
  collectionsController.removeFromWishlist,
  (req, res) => {
    res.status(200);
    res.send(res.locals.query);
  }
);

// Was sending without any data;
app.get('/reviews', collectionsController.getRatings, (req, res) => {
  res.status(200).send(res.locals.userRatings);
});

app.get('/', (req, res) => {
  res.status(200).sendFile(path.join(__dirname, '../../client/src/index.html'));
});

app.use((error, req, res, next) => {
  const defaultErr = {
    log: 'Express error handler caught unknown middleware error',
    status: 500,
    message: { err: 'An error occured' },
  };
  const errorObj = Object.assign({}, defaultErr, error);
  console.log(errorObj.log);
  return res.status(errorObj.status).json(errorObj.message);
});

app.listen(PORT, () => {
  console.log(`Server listening on port: ${PORT}`);
});

module.exports = app;

// /api/search?query=pizza&latitude=35.8490542&longitude=-78.6762052
