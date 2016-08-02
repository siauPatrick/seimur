import React from 'react';
import {connect} from 'react-redux';
import {isEqual, isEmpty} from 'lodash';
import {withRouter} from 'react-router'

import {fetchPair, setLabel} from 'gui/actions/pair';


export class PairDetail extends React.Component {
  componentDidMount() {
    const {dispatch, params} = this.props;
    dispatch(fetchPair(params.id));
  }

  componentWillReceiveProps({pair}) {
    const oldPair = this.props.pair;

    if (!isEmpty(oldPair) && !isEqual(oldPair, pair)) {
      this.props.router.push('/pairs');
    }
  }

  getOnClick(label) {
    const {dispatch, params} = this.props;

    return () => dispatch(setLabel(params.id, label));
  }

  render() {
    const {pair} = this.props;

    return (
      <div>
        {pair.id}
        <div>
          <button onClick={this.getOnClick(1)}>V</button>
          <button onClick={this.getOnClick(-1)}>X</button>
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
