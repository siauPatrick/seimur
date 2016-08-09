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
          <hr/>
          <p className="pair-card__name">{item.nick}</p>
          <hr/>
          <p className="pair-card__name">{item.location && item.location.locationId}</p>
          <hr/>
          <p className="pair-card__name">{item.education}</p>
          <hr/>
          <p className="pair-card__name">{item.firstCompanyLabel}</p>
          <p className="pair-card__name">{item.lastCompanyLabel}</p>
          <hr/>
          {item.sources.map((s) => (<p className="pair-card__name"><a href={s}>{(new URL(s)).hostname}</a></p>))}
        </div>
      ))}
    </Link>
  );
};

export default PairCard;
