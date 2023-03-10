import React from 'react';
import { faMagnifyingGlass, faUser, faHouse, faBurger, faMugHot, faHeart, faMartiniGlass } from '@fortawesome/free-solid-svg-icons';
import styles from '../stylesheets/vertical-nav.css';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const VerticalNav = props => {
  const navigate = useNavigate();

  return (
    <div id="vertical-nav">
      <VerticalNavItem
        iconName={faHouse}
        btnName="home"
        onClickHandler={() => navigate('/')} />
      <VerticalNavItem
        iconName={faUser}
        btnName="user"
        onClickHandler={() => navigate('/login')} />
      <VerticalNavItem
        iconName={faMagnifyingGlass}
        btnName="addRestaurant"
        onClickHandler={() => navigate('/new-restaurant')} />
      <VerticalNavItem
        iconName={faBurger}
        btnName="reviews"
        onClickHandler={() => navigate('/reviews')} />
      <VerticalNavItem
        iconName={faMartiniGlass}
        btnName="wishlist"
        onClickHandler={() => navigate('/wishlist')} />
      <VerticalNavItem
        iconName={faHeart}
        btnName="favorites"
        onClickHandler={() => navigate('/favorites')} />
    </div>
  );
};

const VerticalNavItem = props => {
  return (
    <button
      className="vertical-nav-btn"
      onClick={() => props.onClickHandler(props.btnName)}>
      <FontAwesomeIcon icon={props.iconName} />
    </button>
  );
};


export default VerticalNav;
