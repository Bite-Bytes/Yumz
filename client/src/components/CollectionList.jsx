import React, { Component, useState } from 'react';
import '../stylesheets/listview.css';
import ListItem from './ListItem.jsx';

const CollectionList = (props) => {
  let restaurants;
  if (props.listName === 'Reviews') {
    restaurants = [{
      name: 'Luciano',
      rating: 4,
      is_wishlist: true,
      is_favorite: false,
      googlePlaceId: 'ChIJ15FZYD_2rIkRfnqJkRlmNzI'
    },
    {
      name: 'Nancy\'s Pizzeria',
      rating: 2,
      is_wishlist: false,
      is_favorite: true,
      googlePlaceId: 'ChIJl3ZTXIr3rIkR5R45ePwPzL4'
    }];
  } else if (props.listName === 'Search Results') {
    restaurants = Object.values(props.searchResults);
  } else if (props.listName === 'Wishlist') {
    // SEND GET REQUEST FOR WISHLIST
    restaurants = [{
      name: 'Luciano',
      rating: 4,
      is_wishlist: true,
      is_favorite: false,
      googlePlaceId: 'ChIJ15FZYD_2rIkRfnqJkRlmNzI'
    },
    {
      name: 'Crabtree Ale House',
      is_wishlist: true,
      googlePlaceId: 'ChIJK7QtyUD2rIkRrX8ahHGiLVE'
    }
    ]
  } else if (props.listName === 'Favorites') {
    // SEND GET REQUEST FOR FAVORITES
    restaurants = [{
      name: 'Nancy\'s Pizzeria',
      rating: 2,
      is_wishlist: false,
      is_favorite: true,
      googlePlaceId: 'ChIJl3ZTXIr3rIkR5R45ePwPzL4'
    }];
  }

  return (
    <div className="listview" >
      <div className="collectionTitle">{props.listName}</div>
      <div className="list-items">
        {restaurants.map((listing) => ( //each restautant in array, return a listitem
          <ListItem listing={listing} key={listing.googlePlaceId} />
        ))}
      </div>
    </div>

  );
};

export default CollectionList;