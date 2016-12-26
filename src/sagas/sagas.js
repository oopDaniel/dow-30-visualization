/* eslint-disable no-constant-condition, space-in-parens */
import { call, fork, put, select } from 'redux-saga/effects';
import { takeLatest } from 'redux-saga';
import api from './../services';
import * as actions from './../actions';
import { idsBySelected } from './../reducers/selectors';


export function* fetchLatest(ids) {
  try {
    const { response } = yield call(api.getLatest, ids);
    yield put({ type: actions.FETCH_LATEST_SUCCEEDED, response });
  } catch (error) {
    yield put({ type: actions.FETCH_LATEST_FAILED, error });
  }
}

// Use call() instead of call takeLatest() directly for unit test
export function* watchFetchLatest() {
  yield call(takeLatest, actions.FETCH_LATEST_REQUEST, fetchLatest);
}

export function* init() {
  const ids = yield select(idsBySelected);
  yield fork(fetchLatest, ids);
}
export default function* rootSaga() {
  yield fork(init);
}
