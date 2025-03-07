import React from 'react';
import './Card.css';

const Card = ({ id, image, isFlipped, onClick }) => {
  return (
    <div 
      className={`card ${isFlipped ? 'flipped' : ''}`}
      onClick={() => onClick(id)}
    >
      <div className="card-inner">
        <div className="card-front">
          {}
        </div>
        <div className="card-back">
          <span>{image}</span>
        </div>
      </div>
    </div>
  );
};

export default Card; 