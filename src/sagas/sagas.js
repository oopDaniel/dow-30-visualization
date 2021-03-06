/* eslint-disable no-constant-condition, space-in-parens */
import { call, fork, put, select, take, race } from 'redux-saga/effects';
// import { takeLatest } from 'redux-saga';
import api from './../services/API';
import { loadState, saveState } from './../services/localStorage';
import * as types from './../consts/actionTypes';
import STOCKS from './../consts/stocks';
import * as actions from './../actions';
import { today, GetNameByPeriod } from './../consts/periodEnum';
import {
  getFocused,
  getStockNames,
  getPeriod,
} from './../reducers/selectors';


// Throttle helper func
export const delay = ms => new Promise(resolve => setTimeout(resolve, ms));


export function* fetchLatest(ids) {
  try {
    const response = yield call(api.getLatest, ids);
    if (response.error) throw response.error;
    yield put( actions.fetchLatestSucceeded(response) );
  } catch (error) {
    yield put( actions.fetchLatestFailed(error) );
  }
}

export function* fetchTrend(ids, period) {
  try {
    const response = yield call(api.getTrend, ids, period);
    if (response.error) throw response.error;
    yield put( actions.fetchTrendSucceeded(response) );
  } catch (error) {
    yield put( actions.fetchTrendFailed(error) );
  }
}

export function* watchFetchLatest() {
  while (true) {
    const { target } = yield take(types.FETCH_LATEST_REQUEST);
    yield fork(fetchLatest, target);
  }
}

export function* watchSwitchPeriod() {
  while (true) {
    const { period } = yield take(types.SWITCH_PERIOD);
    const target = yield select(getFocused);
    yield fork(fetchTrend, target, period);
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
      const period = yield select(getPeriod);
      if (GetNameByPeriod[period] === today) {
        yield fork(fetchLatest, [target]);
      } else {
        yield fork(fetchTrend, [target], period);
      }
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
  yield fork(watchSwitchPeriod);
  yield fork(searchWordChanged);
}
