import {
  ADD_FOCUS,
  REMOVE_FOCUS,
} from './../consts/actionTypes';


function focus(state = [], action) {
  switch (action.type) {
    case ADD_FOCUS: {
      return [...state, action.target];
    }
    case REMOVE_FOCUS: {
      return state.filter(stock => stock !== action.target);
    }
    default: {
      return state;
    }
  }
}

export default focus;
