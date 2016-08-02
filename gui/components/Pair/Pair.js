import React from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router';

import Avatar from 'gui/components/Avatar/Avatar'

const Pair = props => {
  const {id, label, items} = props;

  const className = [
    'pair',
    label === 1 && 'pair_same',
    label === -1 && 'pair_not-same'
  ].filter(Boolean).join(' ');

  return (
    <Link to={`/pairs/${id}`} className={className}>
      {items.map(item => (
        <div key={item.id} className="pair__item">
          <Avatar className="pair__avatar" images={item.images}/>
          <p className="pair__name">{item.name}</p>
        </div>
      ))}
    </Link>
  );
};

export default Pair;
