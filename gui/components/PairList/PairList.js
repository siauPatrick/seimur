import React from 'react';
import {connect} from 'react-redux';

import LabelingStatus from 'gui/components/LabelingStatus/LabelingStatus';
import PairCard from 'gui/components/PairCard/PairCard';
import {fetchPairList} from 'gui/actions/pair';


export class PairList extends React.Component {
  componentDidMount() {
    const {dispatch} = this.props;

    dispatch(fetchPairList());
  }

  render() {
    const {pairList} = this.props;

    return (
      <div className="pair-list">
        <LabelingStatus pairList={pairList} />

        {pairList.map(pair => {
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
