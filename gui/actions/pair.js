import {
  REQUEST_PAIR_LIST, RECEIVE_PAIR_LIST,
  REQUEST_PAIR, RECEIVE_PAIR
} from 'gui/constants';


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


function requestPair() {
  return {
    type: REQUEST_PAIR
  }
}


function receivePair(json) {
  return {
    type: RECEIVE_PAIR,
    item: json
  }
}


export function fetchPair(pairId) {
  return (dispatch) => {
    dispatch(requestPair());
    return fetch(`/api/pairs/${pairId}`, {credentials: 'include'})
      .then(response => response.json())
      .then(json => dispatch(receivePair(json)))
  }
}
