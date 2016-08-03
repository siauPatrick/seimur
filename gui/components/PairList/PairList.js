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
            items: [
              {
                id: pair.first.docId,
                name: pair.first.name,
                images: pair.first.pictures
              },
              {
                id: pair.second.docId,
                name: pair.second.name,
                images: pair.second.pictures
              }
            ]
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
