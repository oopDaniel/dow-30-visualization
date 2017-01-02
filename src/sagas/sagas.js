/* eslint-disable no-constant-condition, space-in-parens */
import { call, fork, put, select, take, race } from 'redux-saga/effects';
// import { takeLatest } from 'redux-saga';
import api from './../services/API';
import { loadState, saveState } from './../services/localStorage';
import * as types from './../consts/actionTypes';
import STOCKS from './../consts/stocks';
import * as actions from './../actions';
import { getFocused, getStockNames } from './../reducers/selectors';


// Throttle helper func
export const delay = ms => new Promise(resolve => setTimeout(resolve, ms));


export function* fetchLatest(ids) {
  try {
    const response = yield call(api.getLatest, ids);
    yield put( actions.fetchLatestSucceeded(response) );
  } catch (error) {
    yield put( actions.fetchLatestFailed(error) );
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
    const { type: actionType, target }
      = yield take([types.ADD_FOCUS, types.REMOVE_FOCUS]);

    const stockNames = yield select(getStockNames);
    const shouldCallAPI = actionType === types.ADD_FOCUS
      && !stockNames.includes(target);

    if (shouldCallAPI) {
      yield fork(fetchLatest, [target]);
    }

    const focused = yield select(getFocused);
    yield call(saveState, focused.join(','));
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
      countDown  = 300;
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
