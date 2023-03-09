import React, { useState } from 'react';
import '../stylesheets/ratings-table.css';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import { faStar as hollowStar } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const RatingsTable = props => {

  return (
    <table id="ratings-table">
      <tbody>
        {/* ROW 1 */}
        <tr>
          <td className="rating-label">
            Overall:
          </td>
          <td className="stars">
            <RatingStars starsLabel="overall" key={1} onChange={props.onChange} />
          </td>
        </tr>
        {/* ROW 2 */}
        <tr>
          <td className="rating-label">
            Food:
          </td>
          <td className="stars">
            <RatingStars starsLabel="food" key={2} onChange={props.onChange} />
          </td>
        </tr>
        {/* ROW 3 */}
        <tr>
          <td className="rating-label">
            Price:
          </td>
          <td className="stars">
            <RatingStars starsLabel="price" key={3} onChange={props.onChange} />
          </td>
        </tr>
        {/* ROW 4 */}
        <tr>
          <td className="rating-label">
            Service:
          </td>
          <td className="stars">
            <RatingStars starsLabel="service" key={4} onChange={props.onChange} />
          </td>
        </tr>
        {/* ROW 5 */}
        <tr>
          <td className="rating-label">
            Atmosphere:
          </td>
          <td className="stars">
            <RatingStars starsLabel="atmosphere" key={5} onChange={props.onChange} />
          </td>
        </tr>
      </tbody>
    </table>
  );
};

const RatingStars = props => {
  const [numFilledStars, setNumFilledStars] = useState(0);

  const onStarClick = (e) => {
    const starId = e.target.id
    if (starId.length) {
      const starNum = Number(starId.split('star')[1]);
      setNumFilledStars(starNum);
    } else {
      console.log('empty id');
    }

    props.onChange(e)
  };

  const stars = [];
  let filledStarsCount = 0;
  for (let i = 1; i < 6; i++) {
    let starIcon;
    if (filledStarsCount < numFilledStars) {
      starIcon = faStar;
      filledStarsCount++;
    } else {
      starIcon = hollowStar;
    }

    stars.push(
      <span
        key={i}
      >
        <div
          className="star-overlay"
          id={`${props.starsLabel}-star${i}`}
          onClick={(e) => onStarClick(e)}
        >
        </div>
        <FontAwesomeIcon
          icon={starIcon}
          className="rating-star"
        />
      </span>
    );
  }

  return (
    <span id="rating-stars">
      {stars}
    </span>
  );
};

export default RatingsTable;