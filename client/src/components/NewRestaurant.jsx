import React, { useState, useRef, useEffect } from 'react';
import RestaurantInfo from './RestaurantInfo.jsx';
import RestaurantSearchResult from './RestaurantSearchResult.jsx';
import RatingsTable from './RatingsTable.jsx';
import styles from '../stylesheets/new-restaurant.css';
import detailStyles from '../stylesheets/details-modal.css';
import RatingNotes from './RatingNotes.jsx';
import helperFns from '../helperFns.js';
import { useNavigate } from 'react-router-dom';
import CollectionList from './CollectionList.jsx';
import DetailsModal from './DetailsModal.jsx';

const NewRestaurant = (props) => {
  const [restaurantInfo, setRestaurantInfo] = useState(null);
  const [searchResults, setSearchResults] = useState({});
  const [searchLocation, setSearchLocation] = useState(null);

  // Create two ref objects using the useRef hook, which will be used to reference the Autocomplete instance and the input element
  const autoCompleteRef = useRef();
  const inputRef = useRef();

  // Define the options for the Autocomplete class
  const options = {
    componentRestrictions: { country: 'us' }, // restrict the search to the US
    fields: ['address_components', 'geometry', 'icon', 'name'], // specify what fields to return
    types: ['establishment'], // only return businesses
  };

  // Use the useEffect hook to initialize the Autocomplete instance when the component mounts
  useEffect(() => {
    // Set the value of the autoCompleteRef to a new instance of the Autocomplete class, passing in the input element and the options object as parameters
    autoCompleteRef.current = new window.google.maps.places.Autocomplete(
      inputRef.current,
      options
    );
  }, []);

  useEffect(() => {
    // set the default bounds
    const defaultBounds = {
      north: 37.8324,
      south: 37.5209,
      east: -121.83,
      west: -122.5137,
    };

    let center = { lat: 37.7749, lng: -122.4194 }; // default to SF
    if (searchLocation) {
      // if searchLocation is set, use it as the center point
      center = { lat: searchLocation.lat(), lng: searchLocation.lng() };
    }

    if (searchLocation) {
      // if searchLocation is set, update the bounds and options
      // Create a new bounding box with sides 10km away from the center point
      const updatedBounds = {
        north: center.lat + 0.1,
        south: center.lat - 0.1,
        east: center.lng + 0.1,
        west: center.lng - 0.1,
      };

      // Define the updated options for the Autocomplete instance
      const updatedOptions = {
        bounds: updatedBounds,
        componentRestrictions: { country: 'us' },
        fields: ['address_components', 'geometry', 'icon', 'name'],
        strictBounds: false,
        types: ['establishment'],
      };

      console.log('updatedOptions', updatedOptions);
      // Update the options for the Autocomplete instance
      autoCompleteRef.current.setOptions(updatedOptions);
    } else if (searchLocation === null) {
      // if searchLocation is not set, use the default bounds and options
      // Define the options for the Autocomplete instance
      const defaultOptions = {
        componentRestrictions: { country: 'us' },
        fields: ['address_components', 'geometry', 'icon', 'name'],
        types: ['establishment'],
      };

      // Update the options for the Autocomplete instance
      autoCompleteRef.current.setOptions(defaultOptions);
    }
  }, [searchLocation]);

  const onSearchLocationChange = (event) => {
    const postalCode = event.target.value; // get the value of the input element
    if (/^[0-9]{5}$/.test(postalCode)) {
      // check if input length is 5
      // Use the Geocoder to convert the postal code to a LatLng object
      console.log('geocoding postal code...');
      const geocoder = new window.google.maps.Geocoder(); // create a new Geocoder instance
      geocoder.geocode(
        { address: postalCode, componentRestrictions: { country: 'us' } },
        (results, status) => {
          // geocode the postal code
          if (status === 'OK') {
            // if the geocode was successful
            const lat = results[0].geometry.location.lat(); // get the latitude and longitude from the results
            const lng = results[0].geometry.location.lng();
            const newLocation = new window.google.maps.LatLng(lat, lng); //  and create a new LatLng class
            console.log('lat', newLocation.lat()); //LOG FOR DEBUGGIN
            setSearchLocation(newLocation); // set the searchLocation state to the new LatLng class
          } else {
            console.log(
              'Geocode was not successful for the following reason: ' + status
            );
          }
        }
      );
    } else if (/^current location$/i.test(postalCode)) {
      // handle invalid input length
      console.log('setting search location to NULL...');
      setSearchLocation(null);
    } else {
      setSearchLocation(null);
    }
  };

  const navigate = useNavigate();

  const submitRestaurantName = async (event) => {
    try {
      event.preventDefault();
      console.log(event.currentTarget);
      const nameInput = document.querySelector('#restaurant-name-input');
      const restaurantName = nameInput.value;
      if (!restaurantName.length) {
        // This could be handled better... but no time :(
        alert('Please enter a restaurant name');
        return;
      }

      const locationInput = document.querySelector(
        '#restaurant-location-input'
      );
      const locationVal = locationInput.value;

      let requestUrl = `/api/search?query=${restaurantName}`;

      // - Modify the URL based on what the user input for the location
      // - If they selected Current Location, try using the user's geolocation coordinates
      // - Otherwise for a non-empty string value, append it to the query param
      // - For an empty string, Google Places API will default to user's location (based on IP address of req?)
      if (locationVal === 'Current Location') {
        const userCoords = helperFns.retrieveUserCoords();
        const latitude = Object.hasOwn(userCoords, 'latitude')
          ? userCoords.latitude
          : null;
        const longitude = Object.hasOwn(userCoords, 'longitude')
          ? userCoords.longitude
          : null;

        if (latitude && longitude) {
          requestUrl += `&latitude=${latitude}&longitude=${longitude}`;
        }
      } else if (locationVal.length) {
        requestUrl += `&latitude=${searchLocation.lat()}&longitude=${searchLocation.lng()}`;
      }
      // TODO - not handling scenario where no search results come back..
      console.log(
        'submitRestaurantName, searching for restaurant name:',
        restaurantName,
        'location val: ',
        locationVal
      );

      console.log('NewRestaurant sending request to ', requestUrl);
      const response = await fetch(requestUrl);
      const jsonSearchResults = await response.json();

      console.log('SEARCH RESULTS', jsonSearchResults.results)
      const newSearchResults = {};
      for (const [googlePlaceId, googlePlaceInfo] of Object.entries(
        jsonSearchResults.results
      )) {
        newSearchResults[googlePlaceId] = {
          googlePlaceId: googlePlaceId,
          name: googlePlaceInfo.name,
          address: googlePlaceInfo.address,
        };
      }

      setSearchResults(newSearchResults);
    } catch (error) {
      // This should be better error handling..
      console.log('NewRestaurant submitRestaurantName error', error.message);
    }
  };

  const onSearchResultClick = async (event, selectedRestaurant) => {
    console.log(selectedRestaurant);
    try {
      const googlePlaceId = selectedRestaurant.googlePlaceId;
      const requestUrl = `/api/place-details?placeID=${googlePlaceId}`;

      const response = await fetch(requestUrl);
      const restaurantDetails = await response.json();

      // Note: Google Places API doesn't provide all of the details, so hardcoding for now
      // Yelp API should provide remaining details
      const newRestaurantInfo = await {};
      newRestaurantInfo['googlePlaceId'] = restaurantDetails.id;
      newRestaurantInfo['name'] = restaurantDetails.name;
      newRestaurantInfo['address'] = restaurantDetails.address;
      newRestaurantInfo['category'] = restaurantDetails.category;
      newRestaurantInfo['hours'] = restaurantDetails.hours;
      newRestaurantInfo['reservations'] = restaurantDetails.reservable;
      newRestaurantInfo['delivery'] = restaurantDetails.takeout;

      setSearchResults({});
      setRestaurantInfo(newRestaurantInfo);
    } catch (error) {
      // This should be better error handling..
      console.log('NewRestaurant onSearchResultClick error', error.message);
    }
  };

  const onFinishBtnClick = async () => {
    navigate('/reviews');
  };

  const onReturnSearchBtnClick = () => {
    setSearchResults({});
  };

  const onReturnHomeBtnClick = () => {
    navigate('/');
  };

  const searchResultItems = [];
  for (const [googlePlaceId, googlePlaceInfo] of Object.entries(
    searchResults
  )) {
    searchResultItems.push(
      <RestaurantSearchResult
        name={googlePlaceInfo.name}
        address={googlePlaceInfo.address}
        googlePlaceId={googlePlaceId}
        onSearchResultClick={onSearchResultClick}
        key={googlePlaceId}
      />
    );
  }

  if (searchResultItems.length > 0) {
    // VIEW SEARCH RESULTS
    return (
      <CollectionList
        listName={'Search Results'}
        searchResults={searchResults}
      />
      // <div id='new-restaurant-info'>
      //   <div id='new-restaurant-header'>Search Results</div>
      //   <button
      //     className='new-restaurant-button'
      //     onClick={onReturnSearchBtnClick}>
      //     Return to Search
      //   </button>
      //   {searchResultItems}
      //   {/* Skipping next button functionality for now..
      //   <button id='next-button'>Next</button> */}
      // </div>
    );
  } else if (restaurantInfo === null) {
    // SEARCH FOR A RESTAURANT
    return (
      <div id="new-restaurant-info">
        <div id="new-restaurant-header">Add a Restaurant</div>
        <div className="new-restaurant-prompt">Enter your ZIP code here!</div>
        <form
          onSubmit={(event) => submitRestaurantName(event)}
          autoComplete="off"
        >
          <input
            id="restaurant-location-input"
            name="restaurant-location-input"
            className="new-restaurant-input"
            type="text"
            list="location-options"
            onChange={onSearchLocationChange}
          />
          <datalist id="location-options">
            <option value="Current Location" />
          </datalist>
          <br />
          <label
            className="new-restaurant-prompt"
            htmlFor="restaurant-location-input"
          >
            Add an address!
          </label>
          <br />
          <input
            id="restaurant-name-input"
            name="restaurant-name-input"
            className="new-restaurant-input"
            type="text"
            ref={inputRef}
          />
          <br />
          <input
            type="submit"
            value="Next"
            className="new-restaurant-button"
          ></input>
        </form>
      </div>
    );
  } else {
    // VIEW RESTAURANT DETAILS
    // return (
    //   <div id='new-restaurant-info'>
    //     <div id="restaurant-name">{restaurantInfo.name}</div>
    //     <RestaurantInfo info={restaurantInfo} />
    //     <div className="section-header">
    //       <span>Ratings</span>
    //     </div>
    //     <RatingsTable />
    //     <div className="section-header">
    //       <span>Notes</span>
    //     </div>
    //     <RatingNotes
    //       buttonText='Finish'
    //       clickHandler={onFinishBtnClick} />
    //   </div>
    // );
  }
};

export default NewRestaurant;
