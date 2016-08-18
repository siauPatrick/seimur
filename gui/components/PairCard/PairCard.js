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
            return <Avatar images={item.images} />;

          case 'location':
            return item[key].locationId;

          case 'sources':
            return item.sources.map(source => (
              <a key={source} href={source} className="pair-card__link">
                {(new URL(source)).hostname}
              </a>
            ));

          default:
            return item[key]
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
