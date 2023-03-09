const express = require('express');
const path = require('path');
require('dotenv').config();

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
module.exports = router;
