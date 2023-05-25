import React, { useState, useEffect } from 'react';
import MainNav from './MainNav.jsx';
// import VerticalNav from './VerticalNav.jsx';
// import Header from './Header.jsx';
import styles from '../stylesheets/landing.css';
import { useNavigate } from 'react-router-dom';



const Landing = props => {
  // const [goToLogin, setGoToLogin] = useState(false);
  const navigate = useNavigate();
  // useEffect(() => {
  //   navigate('/login');

  // });

  return (
    <div id='landing'>
      {/* <VerticalNav />
      <Header /> */}
      <MainNav />
    </div>
  );
};

export default Landing;