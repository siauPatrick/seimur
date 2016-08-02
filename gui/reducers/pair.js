import {
  REQUEST_PAIR_LIST, RECEIVE_PAIR_LIST,
  REQUEST_PAIR, RECEIVE_PAIR,
  START_SET_LABEL, END_SET_LABEL
} from 'gui/constants';


const initialState = {
  items: [],
  listIsFetching: false,
  item: {},
  itemIsFetching: false
};


export default function update(state = initialState, action) {
  switch (action.type) {
    case REQUEST_PAIR_LIST:
      return {
        ...state,
        listIsFetching: true
      };
    case RECEIVE_PAIR_LIST:
      return {
        ...state,
        listIsFetching: false,
        items: action.items,
      };
    case REQUEST_PAIR:
      return {
        ...state,
        itemIsFetching: true
      };
    case RECEIVE_PAIR:
      return {
        ...state,
        itemIsFetching: false,
        item: action.item,
      };
    case START_SET_LABEL:
      return {
        ...state,
        itemIsFetching: true
      };
    case END_SET_LABEL:
      return {
        ...state,
        itemIsFetching: false,
        item: action.item,
      };
    default:
      return state
  }
}
