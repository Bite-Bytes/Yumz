const fetch = require('node-fetch');
const path = require('path');

const YELP_FUSION_API_KEY = process.env.YELP_FUSION_API_KEY;

const createError = (errorInfo) => {
  const { method, type, error } = errorInfo;
  return {
    log: `yelpFusionAPIController.${method} ${type}: ERROR: ${
      typeof err === 'object' ? JSON.stringify(error) : error
    }`,
    message: {
      err: `Error occured in yelpFusionAPIController.${method}. Check server logs for more details.`,
    },
  };
};

const yelpFusionAPIController = {};

yelpFusionAPIController.getRestaurantDetails = async (req, res, next) => {
  try {
    console.log('In yelpFusionAPIController.getRestaurantDetails');
    const { name, latitude, longitude } = req.body; //or req.params
    // const {name, latitude, longitude} = req.params
    const restaurantDetailsResponse = await fetch(
      'https://api.yelp.com/v3/businesses/search?' +
        new URLSearchParams({
          term: name,
          latitude,
          longitude,
        }),
      {
        method: 'GET',
        headers: {
          Authorization: 'Bearer ' + YELP_FUSION_API_KEY,
          accept: 'application/json',
        },
      }
    );

    const restaurantDetailsResult = await restaurantDetailsResponse.json();
    // console.log(restaurantDetailsResult.businesses[0]);
    const categories = restaurantDetailsResult.businesses[0].categories;
    const yelpID = restaurantDetailsResult.businesses[0].id;
    const returnedCategories = { category: '' };
    for (let i = 0; i < categories.length; i++) {
      if (i === categories.length - 1)
        returnedCategories.category += `${categories[i].title}`;
      else returnedCategories.category += `${categories[i].title} `;
    }

    res.locals.yelpCategories = returnedCategories;
    // res.locals.restaurantDetailsResults = restaurantDetailsResult;

    return res.json(res.locals.yelpCategories);
  } catch (error) {
    return next(
      createError({
        method: 'getRestaurantDetails',
        type: ' ',
        error,
      })
    );
  }
};

module.exports = yelpFusionAPIController;
// NOTID: {
//   id: 'cbmGkMfR2srqTxV9GHeH1Q',
//   alias: 'mcdonalds-san-jose-30',
//   name: "McDonald's",
//   image_url: 'https://s3-media2.fl.yelpcdn.com/bphoto/-XDXj-iWyY22NZcgO-V24g/o.jpg',
//   is_closed: false,
//   url: 'https://www.yelp.com/biz/mcdonalds-san-jose-30?adjust_creative=XvGbdeECtVkbp5POq0JcKg&utm_campaign=yelp_api_v3&utm_medium=api_v3_business_search&utm_source=XvGbdeECtVkbp5POq0JcKg',
//   review_count: 138,
//   categories: [
//     { alias: 'burgers', title: 'Burgers' },
//     { alias: 'hotdogs', title: 'Fast Food' },
//     { alias: 'coffee', title: 'Coffee & Tea' }
//   ],
//   rating: 1.5,
//   coordinates: { latitude: 37.303899, longitude: -122.031826 },
//   transactions: [ 'delivery' ],
//   price: '$',
//   location: {
//     address1: '1150 S De Anza Blvd',
//     address2: '',
//     address3: '',
//     city: 'San Jose',
//     zip_code: '95129',
//     country: 'US',
//     state: 'CA',
//     display_address: [ '1150 S De Anza Blvd', 'San Jose, CA 95129' ]
//   },
//   phone: '+14087250181',
//   display_phone: '(408) 725-0181',
//   distance: 719.0886351307771
// }

// ID: {
//   id: 'cbmGkMfR2srqTxV9GHeH1Q',
//   alias: 'mcdonalds-san-jose-30',
//   name: "McDonald's",
//   image_url: 'https://s3-media2.fl.yelpcdn.com/bphoto/-XDXj-iWyY22NZcgO-V24g/o.jpg',
//   is_claimed: true,
//   is_closed: false,
//   url: 'https://www.yelp.com/biz/mcdonalds-san-jose-30?adjust_creative=XvGbdeECtVkbp5POq0JcKg&utm_campaign=yelp_api_v3&utm_medium=api_v3_business_lookup&utm_source=XvGbdeECtVkbp5POq0JcKg',
//   phone: '+14087250181',
//   display_phone: '(408) 725-0181',
//   review_count: 138,
//   categories: [
//     { alias: 'burgers', title: 'Burgers' },
//     { alias: 'hotdogs', title: 'Fast Food' },
//     { alias: 'coffee', title: 'Coffee & Tea' }
//   ],
//   rating: 1.5,
//   location: {
//     address1: '1150 S De Anza Blvd',
//     address2: '',
//     address3: '',
//     city: 'San Jose',
//     zip_code: '95129',
//     country: 'US',
//     state: 'CA',
//     display_address: [ '1150 S De Anza Blvd', 'San Jose, CA 95129' ],
//     cross_streets: ''
//   },
//   coordinates: { latitude: 37.303899, longitude: -122.031826 },
//   photos: [
//     'https://s3-media2.fl.yelpcdn.com/bphoto/-XDXj-iWyY22NZcgO-V24g/o.jpg',
//     'https://s3-media4.fl.yelpcdn.com/bphoto/Nwqs720pJKYBihE_lpHJcg/o.jpg',
//     'https://s3-media1.fl.yelpcdn.com/bphoto/1w_FfVJemhQzeSBkcpEPEw/o.jpg'
//   ],
//   price: '$',
//   hours: [ { open: [Array], hours_type: 'REGULAR', is_open_now: true } ],
//   transactions: [ 'delivery' ]
// }
