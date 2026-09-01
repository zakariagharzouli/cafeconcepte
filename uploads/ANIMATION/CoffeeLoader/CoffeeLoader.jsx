import React from 'react';
import './CoffeeLoader.css';

const CoffeeLoader = ({ className = '', style = {} }) => {
  return (
    <div className={`coffee-loader-wrapper ${className}`} style={style}>
      <div className="coffee-loader">
        <div className="container">
          <div className="coffee-header">
            <div className="coffee-header__buttons" />
            <div className="coffee-header__display" />
            <div className="coffee-header__details" />
          </div>
          <div className="coffee-medium">
            <div className="coffe-medium__exit" />
            <div className="coffee-medium__arm" />
            <div className="coffee-medium__liquid" />
            <div className="smoke one" />
            <div className="smoke two" />
            <div className="smoke three" />
            <div className="smoke four" />
            <div className="coffee-medium__cup" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoffeeLoader;
