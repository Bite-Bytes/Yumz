import React, { Component, useState } from 'react';
import DetailsModal from './DetailsModal.jsx';

const ListItem = (props) => {
  const [modalStatus, setModalStatus] = useState(false);
  const [restaurantInfo, setRestaurantInfo] = useState({});
  const [detailsToggle, setDetailsToggle] = useState('Show details');

  console.log('PROPS', props)
  const toggleModal = async (googlePlaceId) => {
    if (modalStatus) {
      setModalStatus(false);
      setDetailsToggle('Show details');
    }

    if (!modalStatus) {
      setDetailsToggle('Loading...');
      await showModal(googlePlaceId);
      setModalStatus(true);
      setDetailsToggle('Hide details');
    }
  };


  const showModal = async (googlePlaceId) => {
    console.log(googlePlaceId);
    try {
      const requestUrl = `/api/place-details?placeID=${googlePlaceId}`;

      const response = await fetch(requestUrl);
      const restaurantDetails = await response.json();

      console.log('RESTAURANT DETAILS', restaurantDetails)
      const newRestaurantInfo = await {};
      newRestaurantInfo['googlePlaceId'] = restaurantDetails.id;
      newRestaurantInfo['name'] = restaurantDetails.name;
      newRestaurantInfo['address'] = restaurantDetails.address;
      newRestaurantInfo['hours'] = restaurantDetails.hours;
      newRestaurantInfo['reservations'] = restaurantDetails.reservable;
      newRestaurantInfo['delivery'] = restaurantDetails.takeout;

      // PASS RESTAURANT NAME AND LATLONG TO BACKEND TO GET BELOW FROM YELP
      newRestaurantInfo['category'] = 'American (Traditional), Pizza, Pasta Shops';
      newRestaurantInfo['parking'] = 'Private lot parking';
      newRestaurantInfo['menu'] = 'https://www.google.com';
      newRestaurantInfo['dress-code'] = 'Casual';
      newRestaurantInfo['credit-cards'] = true;

      setRestaurantInfo(newRestaurantInfo);
    } catch (error) {
      // This should be better error handling..
      console.log('ListItem onSearchResultClick error', error.message);
    }
  };

  const getStars = () => {
    let stars = '★'.repeat(props.listing.rating);
    stars += '☆'.repeat(5 - props.listing.rating);
    return stars;
  }

  const getAddress = () => {
    if (props.listing.address.split()) return props.listing.address.split(',')[0];
    else if (props.listing.address) return props.listing.address;
    else return ''
  }

  return (
    <div className="list-item-container">
      <div className="preview">
        <div>
          <span className="item" id="name">{props.listing.name}</span>
          <span className="item" id="address">{getAddress()}</span>
        </div>
        <div>
          <span className="item" id="stars">{getStars()}</span>
          {/* <span className="item" id="cuisine">{props.listing.cuisine}</span>
      <span className="item" id="hours">{props.listing.hours}</span> */}
          {/* <button type="button" className="previewButton" onClick={() => setModalStatus(true)}>See Details</button> */}
          <button type="button" className="previewButton" onClick={() => toggleModal(props.listing.googlePlaceId)}>{detailsToggle}</button>
        </div>
      </div>
      <DetailsModal restaurantInfo={restaurantInfo} show={modalStatus} />
    </div>
  );
};

export default ListItem;