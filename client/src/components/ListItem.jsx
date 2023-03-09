import React, { Component, useState } from 'react';
import DetailsModal from './DetailsModal.jsx';

const ListItem = (props) => {
  const [modalStatus, setModalStatus] = useState(false);
  const [restaurantInfo, setRestaurantInfo] = useState({});

  const openModal = (e) => {
    return (
      <DetailsModal show={modalStatus} close={() => setModalStatus(false)} />
    );
  };

  const onPreview = async (googlePlaceId) => {
    console.log(googlePlaceId);
    try {
      const requestUrl = `/api/place-details?placeID=${googlePlaceId}`;

      const response = await fetch(requestUrl);
      const restaurantDetails = await response.json();

      console.log('RESTAURANT DETAILS', restaurantDetails);
      const newRestaurantInfo = await {};
      newRestaurantInfo['googlePlaceId'] = restaurantDetails.id;
      newRestaurantInfo['name'] = restaurantDetails.name;
      newRestaurantInfo['address'] = restaurantDetails.address;
      newRestaurantInfo['hours'] = restaurantDetails.hours;
      newRestaurantInfo['reservations'] = restaurantDetails.reservable;
      newRestaurantInfo['delivery'] = restaurantDetails.takeout;

      // PASS RESTAURANT NAME AND LATLONG TO BACKEND TO GET BELOW FROM YELP
      newRestaurantInfo['category'] = restaurantDetails.category;
      newRestaurantInfo['parking'] = 'Private lot parking';
      newRestaurantInfo['menu'] = 'https://www.google.com';
      newRestaurantInfo['dress-code'] = 'Casual';
      newRestaurantInfo['credit-cards'] = true;

      setRestaurantInfo(newRestaurantInfo);
      setModalStatus(true);
    } catch (error) {
      // This should be better error handling..
      console.log('ListItem onSearchResultClick error', error.message);
    }
  };

  return (
    <div className="preview">
      <span className="item" id="name">
        {props.listing.name}
      </span>
      <span className="item" id="stars">
        {props.listing.rating} ☆
      </span>
      <span className="item" id="cuisine">
        {props.listing.cuisine}
      </span>
      <span className="item" id="hours">
        {props.listing.hours}
      </span>
      {/* <button type="button" className="previewButton" onClick={() => setModalStatus(true)}>See Details</button> */}
      <button
        type="button"
        className="previewButton"
        onClick={() => onPreview(props.listing.googlePlaceId)}
      >
        See Details
      </button>
      <DetailsModal
        restaurantInfo={restaurantInfo}
        show={modalStatus}
        close={() => setModalStatus(false)}
      />
    </div>
  );
};

export default ListItem;
