import React, { Component, useState } from 'react';
import '../stylesheets/listview.css';
import ListItem from './ListItem.jsx';

const CollectionList = (props) => {
  let restaurants;
  if (props.listName === 'Reviews') {
    restaurants = [{
      name: 'Ramen House',
      rating: 8,
      cuisine: 'Japanese',
      hours: '11 am - 8 pm, 7 days/wk',
      preview: 'See details',
      googlePlaceId: 'ChIJ15FZYD_2rIkRfnqJkRlmNzI'
    },
    {
      name: 'Ramen place',
      rating: 8,
      cuisine: 'Japanese',
      hours: '11 am - 8 pm, 7 days/wk',
      preview: 'See details',
      googlePlaceId: 'ChIJl3ZTXIr3rIkR5R45ePwPzL4'
    }];
  } else if (props.listName === 'Search Results') {
    restaurants = Object.values(props.searchResults);
  }

  else {
    restaurants = [{
      name: 'Ramen House',
      rating: 8,
      cuisine: 'Japanese',
      hours: '11 am - 8 pm, 7 days/wk',
      preview: 'See details',
      googlePlaceId: 'ChIJl3ZTXIr3rIkR5R45ePwPzL4'
    }]
  }

  return (
    <div className="listview" >
      <div className="collectionTitle">{props.listName}</div>
      {restaurants.map((listing) => ( //each restautant in array, return a listitem
        <ListItem listing={listing} key={listing.id} />
      ))}

    </div>

  );
};

export default CollectionList;