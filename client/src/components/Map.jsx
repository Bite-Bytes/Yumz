import React, { useEffect } from 'react';

function Map( { google, googlePlaceId } ) {

  // useEffect hook to initialize the map and add markers when the component is mounted
  useEffect(() => {
    // get reference to the DOM element where the map will be rendered
    const mapContainer = document.getElementById('map');

    // create a new Google Maps instance with default zoom level
    const map = new window.google.maps.Map(mapContainer, {
      zoom: 13,
    });

    // try to get the user's current location using the geolocation API
    navigator.geolocation.getCurrentPosition(
      // if successful, set the map center to the user's current location
      position => {
        const { latitude, longitude } = position.coords;
        map.setCenter({ lat: latitude, lng: longitude });
      },
      // if there is an error, log it to the console and set the map center to San Francisco
      error => {
        console.error(error);
        map.setCenter({ lat: 37.7749, lng: -122.4194 });
      }
    );

    // create a new PlacesService instance to retrieve details for each place in the googlePlaceId array
    const placesService = new window.google.maps.places.PlacesService(map);
    googlePlaceId.forEach((el) => {
      placesService.getDetails(
        // specify the placeId for each place
        { placeId: el },
        // callback function to create a new marker for each place if the details are retrieved successfully
        (placeResult, status) => {
          if (status === 'OK') {
            const marker = new window.google.maps.Marker({
              position: placeResult.geometry.location,
              map: map,
              title: placeResult.name,
            });
          } else {
            console.error('Error retrieving place details:', status);
          }
        }
      );
    });
  }, []);

  // render a div with id "map" that will be used to render the map
  return <div id="map" style={{ width: '100%', height: '400px' }} />;
}

export default Map;