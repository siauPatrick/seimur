import classNames from 'classnames';
import React from 'react';
import {connect} from 'react-redux';
import {flatten} from 'lodash';
import {Link} from 'react-router';

import Avatar from 'gui/components/Avatar/Avatar'
import PairInfo from 'gui/components/PairInfo/PairInfo';


const KEYS = [
  'avatar',
  'name',
  'nick',
  'location',
  'education',
  'firstCompanyLabel',
  'lastCompanyLabel',
  'sources'
];

const PairCard = (props) => {
  const {id, label, items} = props;

  const className = classNames('pair-card', {
    'pair-card_positive': label === 1,
    'pair-card_negative': label === -1
  });

  const pairInfoProps = {
    items: flatten(KEYS.map(key =>
      items.map(item => {
        switch (key) {
          case 'avatar':
            return {component: <Avatar images={item.images} />};

          case 'location':
            return {key, component: item[key].locationId};

          case 'sources':
            const sources = item.sources.map(source => (
                <a key={source} href={source} className="pair-card__link">
                  {(new URL(source)).hostname}
                </a>
              ));

              return {key, component: sources};

          default:
            const component = Array.isArray(item[key])
              ? item[key].map((name, index) => <p key={index}>{name}</p>)
              : item[key];

            return {key, component: component}
        }
      })
    ))
  };

  return (
    <Link to={`/pairs/${id}`} className={className}>
      <PairInfo {...pairInfoProps} />
    </Link>
  );
};

export default PairCard;
