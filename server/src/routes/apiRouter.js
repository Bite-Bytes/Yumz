const express = require('express');
const path = require('path');
require('dotenv').config();
const restaurantController = require('../controllers/restaurantController');
const collectionsController = require('../controllers/collectionsController');

const googlePlacesAPIController = require('../controllers/googlePlacesAPIController');
const yelpFusionAPIController = require('../controllers/yelpFusionAPIController');

const router = express.Router();

router.get('/', (req, res) => {
  return res.json({ message: 'Hello from API Router' });
});

router.get('/search', googlePlacesAPIController.search);

router.get('/results-next-page', googlePlacesAPIController.getNextPage);

router.get('/place-details', googlePlacesAPIController.getPlaceDetails);

router.get('/yelpCategories', yelpFusionAPIController.getRestaurantDetails);

router.post(
  '/addToWishlist',
  restaurantController.addRestaurant,
  collectionsController.addToWishlist,
  (req, res) => {
    res.status(200);
    res.send(res.locals);
  }
);

router.post(
  '/addToFavorites',
  restaurantController.addRestaurant,
  collectionsController.addToFavorites,
  (req, res) => {
    res.status(200);
    res.send(res.locals);
  }
);

// addToReviews was empty
router.post(
  '/addToReviews',
  restaurantController.addRestaurant,
  collectionsController.addToReviews,
  (req, res) => {
    res.status(200);
    res.send(res.locals.query);
  }
);

router.get(
  '/reviews',
  collectionsController.getReviews,
  collectionsController.processRWF
);

router.get('/userRatings', collectionsController.getRatings);
module.exports = router;
