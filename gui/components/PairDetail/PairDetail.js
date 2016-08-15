import {isEqual, isEmpty, flatten} from 'lodash';
import React from 'react';
import {connect} from 'react-redux';
import {withRouter} from 'react-router'

import Avatar from 'gui/components/Avatar/Avatar';
import PairInfo from 'gui/components/PairInfo/PairInfo';
import {fetchPair, setLabel} from 'gui/actions/pair';


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

export class PairDetail extends React.Component {
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
              return <Avatar images={item.pictures} />;

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
      <div className="pair-detail">
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
