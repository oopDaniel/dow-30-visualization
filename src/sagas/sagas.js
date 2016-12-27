/* eslint-disable no-constant-condition, space-in-parens */
import { call, fork, put, select } from 'redux-saga/effects';
import { takeLatest } from 'redux-saga';
import api from './../services';
import * as types from './../consts/actionTypes';
import * as actions from './../actions';
import { idsBySelected } from './../reducers/selectors';


export function* fetchLatest(ids) {
  try {
    const response = yield call(api.getLatest, ids);
    yield put( actions.fetchLatestSucceeded(response) );
  } catch (error) {
    yield put({ type: types.FETCH_LATEST_FAILED, error });
  }
}

// Use call() instead of call takeLatest() directly for unit test
export function* watchFetchLatest() {
  yield call(takeLatest, types.FETCH_LATEST_REQUEST, fetchLatest);
}

export function* init() {
  const ids = yield select(idsBySelected);
  yield fork(fetchLatest, ids);
}
export default function* rootSaga() {
  yield fork(init);
}
