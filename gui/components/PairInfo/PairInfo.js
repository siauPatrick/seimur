import React from 'react';

const PairInfo = (props) => {
  const {items} = props;

  return (
    <div className="pair-info">
      {items.map((item, index) => (
        <div key={index} className="pair-info__cell">
          {item}
        </div>
      ))}
    </div>
  );
};

export default PairInfo;
