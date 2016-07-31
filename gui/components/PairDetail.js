import React from 'react';
import {connect} from 'react-redux';

import {fetchPair} from '../actions/pair';


export class PairDetail extends React.Component {
  componentDidMount() {
    const {dispatch, params} = this.props;
    dispatch(fetchPair(params.id));
  }

  render() {
    const {isFetching, pair} = this.props;

    return <div>{pair.id}</div>
  }
}

export default connect(
  state => ({
    pair: state.pair.item,
    isFetching: state.pair.itemIsFetching
  })
)(PairDetail)
