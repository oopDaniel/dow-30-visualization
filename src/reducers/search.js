import {
  OPEN_SEARCHBAR,
  CLOSE_SEARCHBAR,
  SEARCH_FOR,
  GOT_SEARCHED_RESULT,
} from './../consts/actionTypes';
import STOCKS from './../consts/stocks';

function search(state = {
  isSearching: false,
  options: STOCKS,
  word: '',
}, action) {
  switch (action.type) {
    case OPEN_SEARCHBAR: {
      return {
        ...state,
        isSearching: true,
      };
    }
    case CLOSE_SEARCHBAR: {
      return {
        ...state,
        isSearching: false,
        word: '',
      };
    }
    case SEARCH_FOR: {
      return {
        ...state,
        word: action.word,
      };
    }
    case GOT_SEARCHED_RESULT: {
      return {
        ...state,
        options: action.result,
      };
    }
    default: {
      return state;
    }
  }
}

export default search;
