const { query } = require('express');
const db = require('../models/userModels.js');

const restaurantController = {};

restaurantController.addRestaurant = async (req, res, next) => {
  try {
    let { is_favorite, is_reviewed, is_wishlist, googleplace_id } = req.body;
    if (!is_favorite) is_favorite = false;
    if (!is_reviewed) is_reviewed = false;
    if (!is_wishlist) is_wishlist = false;
    const user_id = req.cookies.userID;
    // Check for restauraunt should pull the current isFav isRevi and isWish and overwrite those that need to be changed
    const query = await db.query(
      // check if googleplace id is in rest by user id
      `SELECT * FROM restaurant
      WHERE user_id = '${user_id}'
      AND googleplace_id = '${googleplace_id}'`
    );

    if (!query.rows[0]) {
      // This means DB query pulled existing data.
      await db.query(
        `INSERT INTO restaurant (is_favorite, is_reviewed, is_wishlist, user_id, googleplace_id)
        VALUES ('${is_favorite}', '${is_reviewed}', '${is_wishlist}', '${user_ID}', '${googleplace_id}')`
      );
    } else {
      await db.query(
        `UPDATE restaurant
            SET is_wishlist = '${is_wishlist}'
            WHERE googleplace_id = '${googleplace_id}'
            AND user_id = '${user_id} `
      );
    }

    return next();
  } catch (err) {
    return next({
      log: 'restaurantController.addRestaurant() ERROR',
      status: 400,
      message: { err: `in restaurantController.addRestaurant: ${err}` },
    });
  }
};

// restaurantController.addRestaurant = async (req, res, next) => {
//   try {
//     if (req.body.restaurant.restaurant_id !== null) {
//       res.locals.restID = req.body.restaurant.restaurant_id;
//       return next();
//     }
//     const { name, cuisine, price_rating, hours, address, delivery, menu_url } =
//       req.body.restaurant;
//     await db.query(
//       `INSERT INTO restaurants (name, cuisine, price_rating, hours, address, delivery, menu_url)
//       VALUES ('${name}', '${cuisine}', '${price_rating}', '${hours}', '${address}', '${delivery}', '${menu_url}')`
//     );
//     const newRestaurant = await db.query(
//       `SELECT * FROM restaurants WHERE name = '${name}' AND address = '${address}'`
//     );
//     res.locals.restID = newRestaurant.rows[0].restaurant_id;
//     return next();
//   } catch (err) {
//     return next({
//       log: 'restaurantController.addRestaurant() ERROR',
//       status: 400,
//       message: { err: `in restaurantController.addRestaurant: ${err}` },
//     });
//   }
// };

// restaurantController.addRestaurant = async (req, res, next) => {
//   try {
//     if (req.body.restaurant.restaurant_id !== null) {
//       res.locals.restID = req.body.restaurant_id;
//       return next();
//     }
//     const { name, cuisine, price_rating, hours, address, delivery, menu_url } =
//       req.body.restaurant;
//     const insertQuery = `INSERT INTO restaurants (name, cuisine, price_rating, hours, address, delivery, menu_url)
//                          VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING restaurant_id`;
//     const values = [
//       name,
//       cuisine,
//       price_rating,
//       hours,
//       address,
//       delivery,
//       menu_url,
//     ];
//     const result = await db.query(insertQuery, values);
//     const newRestaurantID = result.rows[0].restaurant_id;
//     res.locals.restID = newRestaurantID;
//     return next();
//   } catch (error) {
//     return next({
//       log: 'restaurantController.addRestaurant() ERROR',
//       status: 400,
//       message: { err: `in restaurantController.addRestaurant: ${error}` },
//     });
//   }
// };

module.exports = restaurantController;
