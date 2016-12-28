/* eslint-disable no-constant-condition, space-in-parens */
import { call, fork, put, select, take } from 'redux-saga/effects';
import { takeLatest } from 'redux-saga';
import api from './../services/API';
import { loadState, saveState } from './../services/localStorage';
import * as types from './../consts/actionTypes';
import * as STOCKS from './../consts/stocks';
import * as actions from './../actions';
import { getFocused } from './../reducers/selectors';


export function* fetchLatest(ids) {
  try {
    const response = yield call(api.getLatest, ids);
    yield put( actions.fetchLatestSucceeded(response) );
  } catch (error) {
    yield put({ type: types.FETCH_LATEST_FAILED, error });
  }
}


export function* callFetchLatest(action) {
  if (action && action.target) {
    yield fork(fetchLatest, action.target);
  }
}

// Use call() instead of call takeLatest() directly for unit test
export function* watchFetchLatest() {
  yield call(takeLatest, types.FETCH_LATEST_REQUEST, callFetchLatest);
}


export function* nextFocusedChange() {
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


export function* init() {
  const persisted = yield call(loadState);

  // If no persisted data, load all stocks instead
  const focused = persisted ? persisted.split(',') : STOCKS;
  yield put( actions.loadFocus(focused) );
  yield put( actions.fetchLatestRequest(focused) );
}


export default function* rootSaga() {
  yield fork(init);
  yield fork(nextFocusedChange);
  yield fork(watchFetchLatest);
}
