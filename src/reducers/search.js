import {
  BEGIN_SEARCHING,
  END_SEARCHING,
  SEARCH_FOR,
  GOT_SEARCHED_RESULT,
} from './../consts/actionTypes';
import STOCKS from './../consts/stocks';

function search(state = {
  isSearching: false,
  words: STOCKS,
}, action) {
  switch (action.type) {
    case BEGIN_SEARCHING: {
      return {
        ...state,
        isSearching: true,
      };
    }
    case END_SEARCHING: {
      return {
        ...state,
        isSearching: false,
      };
    }
    case SEARCH_FOR: {
      return state;
    }
    case GOT_SEARCHED_RESULT: {
      return {
        ...state,
        words: action.words,
      };
    }
    default: {
      return state;
    }
  }
}

export default search;
