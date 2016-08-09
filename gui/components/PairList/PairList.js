import {sortBy} from 'lodash';
import React from 'react';
import {connect} from 'react-redux';

import {fetchPairList} from 'gui/actions/pair';

import PairCard from 'gui/components/PairCard/PairCard';

export class PairList extends React.Component {
  componentDidMount() {
    const {dispatch} = this.props;

    dispatch(fetchPairList());
  }

  render() {
    const {pairList} = this.props;

    return (
      <div className="pair-list">
        {sortBy(pairList, pair => !!pair.label).map(pair => {
          const pairCardProps = {
            id: pair.id,
            label: pair.label,
            items: [pair.first, pair.second]
          };

          return <PairCard key={pairCardProps.id} {...pairCardProps} />
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
