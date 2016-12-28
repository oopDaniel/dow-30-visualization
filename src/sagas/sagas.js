/* eslint-disable no-constant-condition, space-in-parens */
import { call, fork, put, select, take } from 'redux-saga/effects';
// import { takeLatest } from 'redux-saga';
import api from './../services/API';
import * as types from './../consts/actionTypes';
import * as actions from './../actions';
import { focusedBySelector } from './../reducers/selectors';


export function* fetchLatest(ids) {
  try {
    const response = yield call(api.getLatest, ids);
    yield put( actions.fetchLatestSucceeded(response) );
  } catch (error) {
    yield put({ type: types.FETCH_LATEST_FAILED, error });
  }
}

// Use call() instead of call takeLatest() directly for unit test
// export function* watchFetchLatest() {
//   yield call(takeLatest, types.FETCH_LATEST_REQUEST, fetchLatest);
// }

export function* nextFocusedChange() {
  while (true) {
    // const prevFocus = yield select(focusedBySelector);
    yield take([types.ADD_FOCUS, types.REMOVE_FOCUS]);

    const focused = yield select(focusedBySelector);
    const shouldCallAPI = focused && focused.length > 0;

    if (shouldCallAPI) {
      yield fork(fetchLatest, focused);
    } else {
      // Empty result
      yield [];
    }

    // ADD_FOCUS or REMOVE_FOCUS will always make the array length different
    // const hasChanged = Array.isArray(prevFocus) &&
    //   Array.isArray(newFocus) &&
    //   prevFocus.length !== newFocus.length;

    // if (hasChanged) {
    //   yield fork(fetchLatest, newFocus);
    // }
  }
}
export default function* rootSaga() {
  yield fork(nextFocusedChange);
}
