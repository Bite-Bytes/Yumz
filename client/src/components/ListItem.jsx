import React, { Component, useState } from 'react';
import DetailsModal from './DetailsModal.jsx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBurger, faMartiniGlass, faMartiniGlassEmpty, faHeart } from '@fortawesome/free-solid-svg-icons';
import { faHeart as hollowHeart } from '@fortawesome/free-regular-svg-icons';


const ListItem = (props) => {
  const [modalStatus, setModalStatus] = useState(false);
  const [restaurantInfo, setRestaurantInfo] = useState({});
  const [detailsToggle, setDetailsToggle] = useState('Show details');
  const [is_favorite, setFavorite] = useState(props.listing.is_favorite);
  const [is_wishlist, setWishlist] = useState(props.listing.is_wishlist);

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
    try {
      const requestUrl = `/api/place-details?placeID=${googlePlaceId}`;

      const response = await fetch(requestUrl);
      const restaurantDetails = await response.json();

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

  const getFavIcon = () => {
    if (is_favorite) return faHeart;
    return hollowHeart;
  }

  const getWishIcon = () => {
    if (is_wishlist) return faMartiniGlass;
    return faMartiniGlassEmpty;
  }

  const toggleFav = async (googlePlaceId) => {
    const newIsFavorite = !is_favorite

    setFavorite(newIsFavorite);

    const reqBody = {
      googleplace_id: googlePlaceId,
      is_favorite: newIsFavorite
    };

    const response = await fetch('/api/addToFavorites', {
      method: 'POST',
      body: JSON.stringify(reqBody),
      headers: { 'Content-Type': 'application/json' }
    })

    const jsonResponse = await response.json();
    console.log(jsonResponse);
  }

  const toggleWish = async (googlePlaceId) => {
    const newIsWishlist = !is_wishlist

    setWishlist(newIsWishlist);

    const reqBody = {
      googleplace_id: googlePlaceId,
      is_wishlist: newIsWishlist
    };

    const response = await fetch('/api/addToWishlist', {
      method: 'POST',
      body: JSON.stringify(reqBody),
      headers: { 'Content-Type': 'application/json' }
    })

    const jsonResponse = await response.json();
    console.log(jsonResponse);
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
          <button type="button" className="wish-button" onClick={() => toggleWish(props.listing.googlePlaceId)}><FontAwesomeIcon icon={getWishIcon()} /></button>
          <button type="button" className="fav-button" onClick={() => toggleFav(props.listing.googlePlaceId)}><FontAwesomeIcon icon={getFavIcon()} /></button>
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
