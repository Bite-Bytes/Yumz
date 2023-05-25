const { query } = require('express');
const db = require('../models/userModels.js');
const GOOGLE_PLACES_API_KEY = process.env.GOOGLE_PLACES_API_KEY;

const collectionsController = {};

collectionsController.getReviews = async (req, res, next) => {
  try {
    console.log(req.cookies);
    const user_id = req.cookies.userID;

    const userReviews = await db.query(
      `SELECT r._id, r.is_favorite, r.is_reviewed, r.is_wishlist, r.user_id, r.googleplace_id, r.yelp_id,
      ra.overall_score, ra.service_score, ra.food_score, ra.atmosphere_score, ra.price_score
      FROM restaurant r
      INNER JOIN rating ra
      ON r._id = ra.rest_id
      WHERE r.user_id = '${user_id}'
      AND ra.user_id = '${user_id}'
      AND r.is_reviewed = true`
    );
    res.locals.userRWF = userReviews.rows;
    res.locals.reviews = true;
    return next();
  } catch (error) {
    return next({
      log: 'error running collectionsController.getReviews middleware.',
      status: 400,
      message: { err: error },
    });
  }
};

collectionsController.getRatings = async (req, res, next) => {
  try {
    const user_id = req.cookies.userID;
    const { googleplace_id } = req.body;
    const userRatings = await db.query(
      `SELECT r.* FROM rating r
      JOIN users u ON r.user_id = u._id
      JOIN restaurant rest ON r.rest_id = rest._id
      WHERE r.user_id = '${user_id}'
      AND rest.is_reviewed = true
      AND rest.googleplace_id = '${googleplace_id}'`
    );
    res.locals.userRatings = userRatings.rows[0];
    return next();
  } catch (error) {
    return next({
      log: 'collectionsController.getRatings() ERROR',
      status: 400,
      message: { err: `in collectionsController.getRatings: ${error}` },
    });
  }
};

collectionsController.getFavorites = async (req, res, next) => {
  try {
    const user_id = req.cookies.userID;
    const userFavorites = await db.query(
      `SELECT r._id, r.is_favorite, r.is_reviewed, r.is_wishlist, r.user_id, r.googleplace_id, r.yelp_id,
      ra.overall_score, ra.service_score, ra.food_score, ra.atmosphere_score, ra.price_score
      FROM restaurant r
      INNER JOIN rating ra
      ON r._id = ra.rest_id
      WHERE r.user_id = '${user_id}'
      AND ra.user_id = '${user_id}'
      AND r.is_favorite = true`
    );
    res.locals.userRWF = userFavorites.rows[0];
    res.locals.favorites = true;
  } catch (error) {
    return next({
      log: 'collectionsController.getFavorites() ERROR',
      status: 400,
      message: { err: `in collectionsController.getFavorites: ${error}` },
    });
  }
};

collectionsController.getWishlist = async (req, res, next) => {
  try {
    const user_id = req.cookies.userID;
    const userWishlist = await db.query(
      `SELECT r._id, r.is_favorite, r.is_reviewed, r.is_wishlist, r.user_id, r.googleplace_id, r.yelp_id,
      ra.overall_score, ra.service_score, ra.food_score, ra.atmosphere_score, ra.price_score
      FROM restaurant r
      INNER JOIN rating ra
      ON r._id = ra.rest_id
      WHERE r.user_id = '${user_id}'
      AND ra.user_id = '${user_id}'
      AND r.is_wishlist = true`
    );
    res.locals.userRWF = userWishlist.rows[0];
    res.locals.wishList = true;
  } catch (error) {
    return next({
      log: 'collectionsController.getWishlist() ERROR',
      status: 400,
      message: { err: `in collectionsController.getWishlist: ${error}` },
    });
  }
};

// collectionsController.addToFavorites = async (req, res, next) => {
//   try {
//     const { restaurant_id, is_favorite } = req.body;
//     const user_id = req.cookies.userID;
//     await db.query(
//       `UPDATE restaurant
//       SET is_favorite = '${is_favorite}'
//       WHERE _id = '${restaurant_id}'
//       AND user_id = '${user_id}'`
//     );
//     return next();
//   } catch (error) {
//     return next({
//       log: 'collectionsController.addToFavorites() ERROR',
//       status: 400,
//       message: { err: `in collectionsController.addToFavorites: ${error}` },
//     });
//   }
// };

// collectionsController.addToWishlist = async (req, res, next) => {
//   try {
//     const { restaurant_id, is_wishlist } = req.body;
//     const user_id = req.cookies.userID;
//     await db.query(
//       `UPDATE restaurant
//       SET is_wishlist = '${is_wishlist}'
//       WHERE _id = '${restaurant_id}'
//       AND user_id = '${user_id}'`
//     );
//     return next();
//   } catch (error) {
//     return next({
//       log: 'collectionsController.addToWishlist() ERROR',
//       status: 400,
//       message: { err: `in collectionsController.addToWishlist: ${error}` },
//     });
//   }
// };

collectionsController.addToReviews = async (req, res, next) => {
  try {
    const {
      date_updated,
      overall_score,
      service_score,
      food_score,
      atmosphere_score,
      price_score,
      notes,
    } = req.body;

    const rest_id = res.locals.restaurantID;
    const user_id = req.cookies.userID;

    const query = await db.query(
      `INSERT INTO rating (user_id, date_updated, overall_score, service_score, food_score, atmosphere_score, price_score, notes, rest_id)
      VALUES ('${user_id}', '${date_updated}', '${overall_score}', '${service_score}', '${food_score}', '${atmosphere_score}', '${price_score}', '${notes}', ${rest_id})`
    );

    res.locals.query = query;
    return next();
  } catch (error) {
    return next({
      log: 'collectionsController.addToReviews() ERROR',
      status: 400,
      message: { err: `in collectionsController.addToReviews: ${error}` },
    });
  }
};
collectionsController.processRWF = async (req, res, next) => {
  console.log('In processing RWF');
  if (res.locals.userRWF[0]) {
    const restaurants = [];
    for (const review of res.locals.userRWF) {
      const {
        googleplace_id,
        overall_score,
        service_score,
        food_score,
        atmosphere_score,
        price_score,
        is_favorite,
        is_wishlist,
      } = review;

      const response = await fetch(
        'https://maps.googleapis.com/maps/api/place/details/json?' +
          new URLSearchParams({
            place_id: googleplace_id,
            key: GOOGLE_PLACES_API_KEY,
          })
      );

      const data = await response.json();
      const result = data.result;
      const avgScore = Math.round(
        (overall_score +
          service_score +
          food_score +
          atmosphere_score +
          price_score) /
          5
      );

      const restaurant = {
        name: result.name,
        rating: avgScore,
        is_favorite: is_favorite,
        is_wishlist: is_wishlist,
        googlePlaceId: googleplace_id,
      };
      restaurants.push(restaurant);
    }
    console.log('RESTAURANTS:', restaurants);
    res.locals.getReviews = restaurants;
    res.json(restaurants);
  } else {
    res.json([]);
  }
};
// collectionsController.removeFromFavorites = async (req, res, next) => {
//   try {
//     const { restaurant_id } = req.body;
//     const user_id = req.cookies.userID;
//     await db.query(
//       `UPDATE restaurant
//       SET is_favorite = false
//       WHERE _id = '${restaurant_id}'
//       AND user_id = '${user_id}'`
//     );
//     return next();
//   } catch (error) {
//     return next({
//       log: 'collectionsController.removeFromFavorites() ERROR',
//       status: 400,
//       message: {
//         err: `in collectionsController.removeFromFavorites: ${error}`,
//       },
//     });
//   }
// };

// collectionsController.removeFromWishlist = async (req, res, next) => {
//   try {
//     const { restaurant_id } = req.body;
//     const user_id = req.cookies.userID;
//     await db.query(
//       `UPDATE restaurant
//       SET is_wishlist = false
//       WHERE _id = '${restaurant_id}'
//       AND user_id = '${user_id}'`
//     );
//     return next();
//   } catch (error) {
//     return next({
//       log: 'collectionsController.addToWishlist() ERROR',
//       status: 400,
//       message: { err: `in collectionsController.addToWishlist: ${error}` },
//     });
//   }
// };

module.exports = collectionsController;

/*

const body = {
      "user_id": 1,
      "collection_id": 99,
      "restaurant": {
        "restaurant_id": 1234,
        "name": "some restaurant name",
        "address": "123 Something St"
        ....
      },
      "rating": {
        "rating_id": 5678,
        "overall_score": 8,
        "food_score": 3,
        ...
      }
    };

*/
