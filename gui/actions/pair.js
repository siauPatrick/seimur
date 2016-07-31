import fetch from 'isomorphic-fetch';

import { REQUEST_PAIR_LIST, RECEIVE_PAIR_LIST } from '../constants';


function requestPairList() {
  return {
    type: REQUEST_PAIR_LIST
  }
}


function receivePairList(json) {
  return {
    type: RECEIVE_PAIR_LIST,
    items: json
  }
}


export function fetchPairList() {
  return (dispatch) => {
    dispatch(requestPairList());
    return fetch('/api/pairs', {credentials: 'include'})
      .then(response => response.json())
      .then(json => dispatch(receivePairList(json)))
  }
}
