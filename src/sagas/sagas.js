/* eslint-disable no-constant-condition, space-in-parens */
import { call, fork, put, select, take, race } from 'redux-saga/effects';
// import { takeLatest } from 'redux-saga';
import api from './../services/API';
import { loadState, saveState } from './../services/localStorage';
import * as types from './../consts/actionTypes';
import STOCKS from './../consts/stocks';
import * as actions from './../actions';
import { getFocused } from './../reducers/selectors';


// Throttle helper func
export const delay = ms => new Promise(resolve => setTimeout(resolve, ms));


export function* fetchLatest(ids) {
  try {
    const response = yield call(api.getLatest, ids);
    yield put( actions.fetchLatestSucceeded(response) );
  } catch (error) {
    yield put({ type: types.FETCH_LATEST_FAILED, error });
  }
}

export function* watchFetchLatest() {
  while (true) {
    const { target } = yield take(types.FETCH_LATEST_REQUEST);
    yield fork(fetchLatest, target);
  }
}

export function* nextFocusedChanged() {
  while (true) {
    // const prevFocus = yield select(getFocused);
    yield take([types.ADD_FOCUS, types.REMOVE_FOCUS]);

    const focused = yield select(getFocused);
    const shouldCallAPI = focused && focused.length > 0;

    if (shouldCallAPI) {
      yield fork(fetchLatest, focused);
    } else {
      // Empty result
      yield [];
    }

    yield call(saveState, focused.join(','));
    // ADD_FOCUS or REMOVE_FOCUS will always make the array length different
    // const hasChanged = Array.isArray(prevFocus) &&
    //   Array.isArray(newFocus) &&
    //   prevFocus.length !== newFocus.length;

    // if (hasChanged) {
    //   yield fork(fetchLatest, newFocus);
    // }
  }
}

export function* handleSearch(word) {
  const result = yield STOCKS.filter(name => name.includes(word));
  yield put( actions.gotSearchResult(result) );
}

export function* searchWordChanged() {
  let lastAction;
  let lastTime  = Date.now();
  let countDown = 0;
  while (true) {
    const winner = yield race({
      action: take(types.SEARCH_FOR),
      timeout: countDown ? call(delay, countDown) : null,
    });
    const now  = Date.now();
    countDown -= (now - lastTime);
    lastTime   = now;
    lastAction = winner && winner.action;

    if (lastAction && countDown <= 0) {
      const { word } = lastAction;
      yield fork(handleSearch, word);
      lastAction = null;
      countDown  = 500;
    }
    // const { word } = yield take(types.SEARCH_FOR);
    // yield fork(handleSearch, word);
    // yield call(delay, 500);
  }
}

// Restore the persisted focused list in localStorage
export function* init() {
  const persisted = yield call(loadState);

  // If no persisted data, load all stocks instead
  const focused = persisted ? persisted.split(',') : STOCKS;
  yield put( actions.loadFocus(focused) );
  yield put( actions.fetchLatestRequest(focused) );
}


export default function* rootSaga() {
  yield fork(init);
  yield fork(nextFocusedChanged);
  yield fork(watchFetchLatest);
  yield fork(searchWordChanged);
}
