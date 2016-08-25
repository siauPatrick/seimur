import classNames from 'classnames';
import React from 'react';
import {connect} from 'react-redux';
import {isEqual, isEmpty, flatten} from 'lodash';
import {withRouter} from 'react-router';

import Avatar from 'gui/components/Avatar/Avatar';
import PairInfo from 'gui/components/PairInfo/PairInfo';
import {fetchPair, resetPair, setLabel} from 'gui/actions/pair';


const KEYS = [
  'avatar',
  'names',
  'nicks',
  'locations',
  'educations',
  'firstCompanyLabel',
  'lastCompanyLabel',
  'sources'
];

export class PairDetail extends React.Component {
  componentWillUnmount() {
    const {dispatch} = this.props;
    dispatch(resetPair());
  }

  componentDidMount() {
    const {dispatch, params} = this.props;
    dispatch(fetchPair(params.id));
  }

  componentWillReceiveProps({pair}) {
    const oldPair = this.props.pair;

    if (!isEmpty(oldPair) && oldPair.id === pair.id && !isEqual(oldPair, pair)) {
      this.props.router.push('/pairs');
    }
  }

  getOnClick(label) {
    const {dispatch, params} = this.props;

    return () => dispatch(setLabel(params.id, label));
  }

  render() {
    const {pair} = this.props;

    if(isEmpty(pair)) {
      return null;
    }

    const items = [pair.first, pair.second];

    const pairInfoProps = {
      items: flatten(KEYS.map(key =>
        items.map(item => {
          switch (key) {
            case 'avatar':
              return {component: <Avatar images={item.images} />};

            case 'locations':
              return {key, component: item[key].map((location, index) => <p key={index}>{location.locationId}</p>)};

            case 'educations':
              return {key, component: item[key].map((education, index) => <p key={index}>{education.nameRaw}</p>)};

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

    const className = classNames('pair-detail', {
      'pair-detail_positive': pair.label === 1,
      'pair-detail_negative': pair.label === -1
    });

    return (
      <div className={className}>
        <PairInfo {...pairInfoProps} />
        <div className="pair-detail__buttons">
          <span className="pair-detail__button" onClick={this.getOnClick(1)} />
          <span className="pair-detail__button" onClick={this.getOnClick(-1)} />
        </div>
      </div>
    )
  }
}

export default connect(
  state => ({
    pair: state.pair.item,
    isFetching: state.pair.itemIsFetching
  })
)(withRouter(PairDetail))
