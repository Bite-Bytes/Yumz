import React, { Component, useState, useEffect } from 'react';
import { Route, BrowserRouter, Routes } from 'react-router-dom';
import { Login } from './Login.jsx';
import { Signup } from './Signup.jsx';
import { Favorites } from './Favorites.jsx';
import { Wishlist } from './Wishlist.jsx';
import Landing from './Landing.jsx';
import CollectionList from './CollectionList.jsx';
import DetailsModal from './DetailsModal.jsx';
import NewRestaurant from './NewRestaurant.jsx';
import { useNavigate } from 'react-router-dom';
import helperFns from '../helperFns.js';
import VerticalNav from './VerticalNav.jsx';
import Header from './Header.jsx';
import '../stylesheets/App.css';


function App() {
  useEffect(() => {
    console.log(helperFns);
    helperFns.getUserCoords();
  }, []);

  return (
    <div className="router">
      <VerticalNav />
      <Header />
      <div id="main-container">
        <Routes>
          <Route path='/signup' element={<Signup />} />
          <Route path='/login' element={<Login />} />
          {/* <Route path='/collection' element={<CollectionList />} /> */}
          <Route path='/' element={<Landing />} />
          <Route path='/reviews' element={<CollectionList listName="Reviews" />} />
          <Route path='/favorites' element={<CollectionList listName="Favorites" />} />
          <Route path='/wishlist' element={<CollectionList listName="Wishlist" />} />
          {/* <Route path='/details-modal' element={<DetailsModal show={true} />} /> */}
          <Route path='/new-restaurant' element={<NewRestaurant />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;