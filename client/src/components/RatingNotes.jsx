import React from 'react';
import styles from '../stylesheets/rating-notes.css';

const RatingNotes = props => {
  return (
    <div>
      <textarea id="rating-notes" type="text" onChange={props.onChange} />
      <button className="details-modal-button"
        onClick={props.clickHandler}>
        {props.buttonText}
      </button>
    </div>
  );
};

export default RatingNotes;