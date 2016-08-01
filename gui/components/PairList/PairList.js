import React from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router';

import {fetchPairList} from 'gui/actions/pair';


function Pair({pair}) {
  return (
    <p>
      <Link to={`/pairs/${pair.id}`} >
        {pair.id}
      </Link>
    </p>
  )
}


export class PairList extends React.Component {
  componentDidMount() {
    const {dispatch} = this.props;
    dispatch(fetchPairList());
  }

  render() {
    const {isFetching, pairList} = this.props;

    return (
      <div>
        {pairList.map(p => <Pair key={p.id} pair={p} />)}
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
