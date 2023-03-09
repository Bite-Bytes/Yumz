import React from 'react';
import { faBurger, faMartiniGlass, faHeart } from '@fortawesome/free-solid-svg-icons';
import styles from '../stylesheets/main-nav.css';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const MainNav = props => {
  const navigate = useNavigate();

  // const onMainNavBtnClick = (event, btnName) => {
  //   console.log(btnName, 'clicked!');
  //   navigate('/collection');
  // };

  // Note: if we add the feature to allow users to create custom collections,
  // then MainNavItem components can be generated on the results of a GET for a user's
  // collections
  return (
    <div id="main-nav">
      <MainNavItem
        iconName={faBurger}
        btnId="main-nav-reviews"
        btnText="Reviews"
        onClickHandler={(e) => navigate('/reviews')} />
      <MainNavItem
        iconName={faMartiniGlass}
        btnId="main-nav-wishlist"
        btnText="Wishlist"
        onClickHandler={(e) => navigate('/wishlist')} />
      <MainNavItem
        iconName={faHeart}
        btnId="main-nav-favorites"
        btnText="Favorites"
        onClickHandler={(e) => navigate('/favorites')} />
    </div>
  );
};

const MainNavItem = props => {
  return (
    <button
      id={props.btnId}
      className="main-nav-btn"
      onClick={(event) => props.onClickHandler(event, props.btnText)}>
      {props.btnText}<br />
      <FontAwesomeIcon
        icon={props.iconName}
        className="main-nav-icon" />
    </button>
  );
};

export default MainNav;