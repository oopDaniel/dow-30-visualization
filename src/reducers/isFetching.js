import {
  FETCH_LATEST_REQUEST,
  FETCH_LATEST_SUCCEEDED,
  FETCH_LATEST_FAILED,
} from './../consts/actionTypes';

const isFetching = (state = false, action) => {
  switch (action.type) {
    case FETCH_LATEST_REQUEST: {
      return true;
    }
    case FETCH_LATEST_SUCCEEDED:
    case FETCH_LATEST_FAILED: {
      return false;
    }
    default: {
      return state;
    }
  }
};

export default isFetching;
