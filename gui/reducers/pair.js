import { REQUEST_PAIR_LIST, RECEIVE_PAIR_LIST } from '../constants';


const initialState = {
  items: [],
  isFetching: false
};


export default function update(state = initialState, action) {
  switch (action.type) {
    case REQUEST_PAIR_LIST:
      return {
        ...state,
        isFetching: true
      };
    case RECEIVE_PAIR_LIST:
      return {
        ...state,
        isFetching: false,
        items: action.items,
      };
    default:
      return state
  }
}
