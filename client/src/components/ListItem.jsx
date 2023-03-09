import React, { Component, useState } from 'react';
import DetailsModal from './DetailsModal.jsx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBurger, faMugHot, faHeart } from '@fortawesome/free-solid-svg-icons';
import { faHeart as hollowHeart } from '@fortawesome/free-regular-svg-icons';


const ListItem = (props) => {
  const [modalStatus, setModalStatus] = useState(false);
  const [restaurantInfo, setRestaurantInfo] = useState({});
  const [detailsToggle, setDetailsToggle] = useState('Show details');
  const [favIcon, setFavIcon] = useState(hollowHeart);

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

      console.log('RESTAURANT DETAILS', restaurantDetails);
      const newRestaurantInfo = await {};
      newRestaurantInfo['googlePlaceId'] = restaurantDetails.id;
      // newRestaurantInfo['yelpId'] = restaurantDetails.yelpId || 'get from yelp';
      newRestaurantInfo['name'] = restaurantDetails.name;
      newRestaurantInfo['address'] = restaurantDetails.address;
      newRestaurantInfo['hours'] = restaurantDetails.hours;
      newRestaurantInfo['reservations'] = restaurantDetails.reservable;
      newRestaurantInfo['delivery'] = restaurantDetails.takeout;
      newRestaurantInfo['category'] = restaurantDetails.category;

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
    if (props.listing.address) return props.listing.address.split(',')[0];
    else return ''
  }

  const toggleFav = async (googlePlaceId) => {
    let is_favorite;

    // NEED GET RESTAURANT ROUTE FROM BE - FOR NOW RELYING ON STATE
    if (favIcon === hollowHeart) {
      is_favorite = false;
      setFavIcon(faHeart);
    } else if (favIcon === faHeart) {
      is_favorite = true;
      setFavIcon(hollowHeart);

      const reqBody = {
        googleplace_id: googlePlaceId,
        is_favorite: true
      };

      // const response = await fetch('/addToFavorites', {
      //   method: 'POST',
      //   body: JSON.stringify
      // })

    }

    return (
      <div className="list-item-container">
        <div className="preview">
          <div>
            <span className="item" id="name">{props.listing.name}</span>
            <span className="item" id="address">{getAddress()}</span>
          </div>
          <div>
            <button type="button" className="fav-button" onClick={() => toggleFav(props.listing.googlePlaceId)}><FontAwesomeIcon icon={favIcon} /></button>
            <span className="item" id="stars">{getStars()}</span>
            {/* <span className="item" id="cuisine">{props.listing.cuisine}</span>
      <span className="item" id="hours">{props.listing.hours}</span> */}
            {/* <button type="button" className="previewButton" onClick={() => setModalStatus(true)}>See Details</button> */}
            <button type="button" className="preview-button" onClick={() => toggleModal(props.listing.googlePlaceId)}>{detailsToggle}</button>
          </div>
        </div>
        <DetailsModal restaurantInfo={restaurantInfo} show={modalStatus} />
      </div>
    );
  };

  export default ListItem;
