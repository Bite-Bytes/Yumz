import React, { useState } from 'react';
import RatingsTable from './RatingsTable.jsx';
import RestaurantInfo from './RestaurantInfo.jsx';
import RatingNotes from './RatingNotes.jsx';
import styles from '../stylesheets/details-modal.css';

const DetailsModal = props => {
  const [stars, setStars] = useState({
    overall: null,
    food: null,
    price: null,
    service: null,
    atmosphere: null
  })
  const [notes, setNotes] = useState(null);

  const onSaveChangesBtnClick = async () => {
    const reqBody = {
      googleplace_id: props.restaurantInfo.googlePlaceId,
      is_reviewed: true,
      overall_score: stars.overall,
      service_score: stars.service,
      food_score: stars.food,
      atmosphere_score: stars.atmosphere,
      price_score: stars.price,
      notes: notes,
    };

    const response = await fetch('/api/addToReviews', {
      method: 'POST',
      body: JSON.stringify(reqBody),
      headers: { 'Content-Type': 'application/json' }
    })

    const jsonResponse = await response.json();
    console.log(jsonResponse);
  }

  const handleStarsChange = (e) => {
    const category = e.target.id.split('-')[0];
    const rating = e.target.id.split('').pop();

    const newStars = { ...stars };
    newStars[category] = rating;
    setStars(newStars);
  }

  const handleNotesChange = (e) => {
    setNotes(e.target.value);
  }


  // TO DO - set last edited date text
  // const lastEdited = 'last edited March 6, 2023';

  if (props.show === true) {
    return (
      <div id="details-modal">
        <div id="restaurant-name">
          {props.restaurantInfo.name}
        </div>
        <RestaurantInfo info={props.restaurantInfo} />
        <div className="section-header">
          <span className="section-title">Ratings
            {/* <span id="last-edited-date">({lastEdited})</span> */}
          </span>
          <RatingsTable stars={stars} onChange={handleStarsChange} />
        </div>
        {/* TO DO - set numStarsFilled from props */}
        <div className="section-header">
          <span className="section-title">Notes</span>
          <RatingNotes
            notes={notes}
            onChange={handleNotesChange}
            clickHandler={onSaveChangesBtnClick}
            buttonText='Save Changes' />
        </div>
      </div>
    );
  }
}

export default DetailsModal;