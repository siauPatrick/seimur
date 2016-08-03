import React from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router';
import classNames from 'classnames';

import Avatar from 'gui/components/Avatar/Avatar'

const PairCard = (props) => {
  const {id, label, items} = props;

  const className = classNames('pair-card', {
      'pair-card_same': label === 1,
      'pair-card_not-same': label === -1
    });

  return (
    <Link to={`/pairs/${id}`} className={className}>
      {items.map(item => (
        <div key={item.id} className="pair-card__item">
          <Avatar className="pair-card__avatar" images={item.images}/>
          <p className="pair-card__name">{item.name}</p>
        </div>
      ))}
    </Link>
  );
};

export default PairCard;
