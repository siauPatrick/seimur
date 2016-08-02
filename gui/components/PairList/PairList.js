import _ from 'lodash';
import React from 'react';
import {connect} from 'react-redux';

import {fetchPairList} from 'gui/actions/pair';

import Pair from 'gui/components/Pair/Pair';

export class PairList extends React.Component {
  componentDidMount() {
    const {dispatch} = this.props;

    dispatch(fetchPairList());
  }

  render() {
    const {pairList} = this.props;

    return (
      <div className="pair-list">
        {_.sortBy(pairList, pair => !!pair.label).map(pair => {
          const pairProps = {
            id: pair.id,
            label: pair.label,
            items: [
              {
                name: pair.first.name,
                images: pair.first.pictures
              },
              {
                name: pair.second.name,
                images: pair.second.pictures
              }
            ]
          };

          return <Pair key={pairProps.id} {...pairProps} />
        })}
      </div>
    )
  }
}


export default connect(
  state => ({
    pairList: state.pair.items,
    isFetching: state.pair.listIsFetching
  })
)(PairList)
