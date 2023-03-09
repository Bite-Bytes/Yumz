const { query } = require('express');
const db = require('../models/userModels.js');

// const createError = (errorInfo) => {
//   const {method, type, error} = errorInfo;
//   return {
//     log: `userController.${method} ${type}: ERROR: ${typeof error === 'object' ? JSON.stringify(error):error}`,
//     message: {err: `error occurreed in userController.${method}. Check server logs for more details.`}
//   };
// };

const collectionsController = {};

collectionsController.getRatings = async (req, res, next) => {
  try {
    /*
     {
      name: 'Ramen House',
      rating: 8,
      cuisine: 'Japanese',
      hours: '11 am - 8 pm, 7 days/wk',
      preview: 'Lorem ipsum...',
      id: 1,
    },
    */
    const { restaurant_id } = req.body;
    const userID = req.cookies.userID;
    const userReviews = await db.query(
      `SELECT r.googleplace_id, r.yelp_id, u._id, u.name, ra.* from restaurant r
      RIGHT OUTER JOIN users u ON r.user_id = '${userID}'
      RIGHT OUTER JOIN rating ra ON ra.user_id = '${userID}'
      `
    );
    const userRatings = await db.query(
      `SELECT r.* FROM rating r
      JOIN users u ON r.user_id = u._id
      JOIN restaurant rest ON r.rest_id = rest._id
      WHERE r.user_id = '${userID}'
      AND r.rest_id = '${restaurant_id}'
      AND rest.is_reviewed = true`
    );
    res.locals.userRatings = userRatings.rows;
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
    const { user_id } = req.body;
    const userFavorites = await db.query(
      `SELECT r.* FROM restaurant r
      JOIN users u ON r.user_id = u._id
      WHERE r.user_id = '${user_id}' AND r.is_favorite = true`
    );
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
    const { user_id } = req.body;
    const userWishlist = await db.query(
      `SELECT *
      FROM users u
      JOIN restaurant r ON u._id = r.user_id
      WHERE u._id = '${user_id}' AND r.is_wishlist = true;`
    );
  } catch (error) {
    return next({
      log: 'collectionsController.getWishlist() ERROR',
      status: 400,
      message: { err: `in collectionsController.getWishlist: ${error}` },
    });
  }
};

collectionsController.addToFavorites = async (req, res, next) => {
  try {
    const { restaurant_id, user_id } = req.body;
    await db.query(
      `UPDATE restaurant
      SET is_favorite = true
      WHERE _id = '${restaurant_id}'
      AND user_id = '${user_id}'`
    );
    return next();
  } catch (error) {
    return next({
      log: 'collectionsController.addToFavorites() ERROR',
      status: 400,
      message: { err: `in collectionsController.addToFavorites: ${error}` },
    });
  }
};

collectionsController.addToWishlist = async (req, res, next) => {
  try {
    const { restaurant_id, user_id } = req.body;
    await db.query(
      `UPDATE restaurant
      SET is_wishlist = true
      WHERE _id = '${restaurant_id}'
      AND user_id = '${user_id}'`
    );
    return next();
  } catch (error) {
    return next({
      log: 'collectionsController.addToWishlist() ERROR',
      status: 400,
      message: { err: `in collectionsController.addToWishlist: ${error}` },
    });
  }
};

// Complete addToReviews
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
      rest_id,
    } = req.body;
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

collectionsController.removeFromFavorites = async (req, res, next) => {
  try {
    const { restaurant_id, user_id } = req.body;
    await db.query(
      `UPDATE restaurant
      SET is_favorite = false
      WHERE _id = '${restaurant_id}'
      AND user_id = '${user_id}'`
    );
    return next();
  } catch (error) {
    return next({
      log: 'collectionsController.removeFromFavorites() ERROR',
      status: 400,
      message: {
        err: `in collectionsController.removeFromFavorites: ${error}`,
      },
    });
  }
};

collectionsController.removeFromWishlist = async (req, res, next) => {
  try {
    const { restaurant_id, user_id } = req.body;
    await db.query(
      `UPDATE restaurant
      SET is_wishlist = false
      WHERE _id = '${restaurant_id}'
      AND user_id = '${user_id}'`
    );
    return next();
  } catch (error) {
    return next({
      log: 'collectionsController.addToWishlist() ERROR',
      status: 400,
      message: { err: `in collectionsController.addToWishlist: ${error}` },
    });
  }
};

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
