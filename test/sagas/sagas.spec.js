/* eslint-disable no-unused-vars, no-constant-condition,
  import/no-extraneous-dependencies, no-multi-spaces,
  padded-blocks, no-prototype-builtins */

import test from 'tape';
import { takeLatest } from 'redux-saga';
import { call, put, select, take, fork, race } from 'redux-saga/effects';
import * as actions from './../../src/actions';
import { getFocused } from './../../src/reducers/selectors';
import * as types from './../../src/consts/actionTypes';
import STOCKS from './../../src/consts/stocks';
import api from './../../src/services/API';
import { loadState, saveState } from './../../src/services/localStorage';
import {
  watchFetchLatest,
  init,
  nextFocusedChanged,
  callFetchLatest,
  fetchLatest,
  searchWordChanged,
  handleSearch,
  delay,
} from './../../src/sagas/sagas';


test('Initial state saga', (assert) => {
  const iterator = init();
  let msg    = 'must call localStorage API';
  let expect = call(loadState);
  let actual = iterator.next().value;

  assert.deepEqual(actual, expect, msg);


  const mock = ['PINEAPPLE', 'PEN'];
  msg    = 'must update the focused using either API result or predefined data';
  expect = put(actions.loadFocus(mock));
  actual = iterator.next(mock.join(',')).value;

  assert.deepEqual(actual, expect, msg);


  msg    = 'must request for the latest stock according to the focused';
  expect = put(actions.fetchLatestRequest(mock));
  actual = iterator.next().value;

  assert.deepEqual(actual, expect, msg);

  assert.end();
});


test('Watcher for fetching \'latest\' request saga', (assert) => {
  const iterator = watchFetchLatest();
  let msg        = 'must take every \'latest\' request and call according func';
  let expect     = take(types.FETCH_LATEST_REQUEST);
  let actual     = iterator.next().value;

  assert.deepEqual(actual, expect, msg);


  msg      = 'must call fetchLatest with proper params';
  expect   = fork(fetchLatest, ['APPLE']);
  actual   = iterator.next({ target: ['APPLE'] }).value;

  assert.deepEqual(actual, expect, msg);


  msg      = 'must go back to beginning of loop';
  expect   = take(types.FETCH_LATEST_REQUEST);
  actual   = iterator.next().value;

  assert.deepEqual(actual, expect, msg);

  assert.end();
});


test('Watcher saga for changes of the focused', (assert) => {
  const iterator = nextFocusedChanged();
  let msg    = 'must take either ADD_FOCUS or REMOVE_FOCUS action';
  let expect = take([types.ADD_FOCUS, types.REMOVE_FOCUS]);
  let actual = iterator.next().value;

  assert.deepEqual(actual, expect, msg);


  msg    = 'must select the new change of the focused';
  expect = select(getFocused);
  actual = iterator.next().value;

  assert.deepEqual(actual, expect, msg);


  msg    = 'delegate to fetchLatest for new stocks in the focused';
  expect = fork(fetchLatest, ['APPLE']);
  actual = iterator.next(['APPLE']).value;

  assert.deepEqual(actual, expect, msg);


  msg    = 'must call localStorage API';
  expect = call(saveState, 'APPLE');
  actual = iterator.next().value;

  assert.deepEqual(actual, expect, msg);


  msg    = 'must go back to beginning of loop';
  expect = take([types.ADD_FOCUS, types.REMOVE_FOCUS]);
  actual = iterator.next().value;

  assert.deepEqual(actual, expect, msg);


  msg    = 'must handle the empty array correctly';
  expect = [];
  iterator.next();
  actual = iterator.next([]).value;

  assert.deepEqual(actual, expect, msg);

  assert.end();
});


test('Fetching \'latest\' saga', (assert) => {

  let msg    = 'must call getLatest API as the initial step';
  let mock   = ['AA', 'BA'];
  const iterator = fetchLatest(mock);
  let expect = call(api.getLatest, mock);
  let actual = iterator.next().value;

  assert.deepEqual(actual, expect, msg);


  msg    = 'must dispatch success after a successful API call';
  mock   = {
    name: 'AA',
    open: 10,
    close: 20,
  };
  const getMock = () => (mock);
  expect = put(actions.fetchLatestSucceeded(mock));
  actual = iterator.next(getMock()).value;

  assert.deepEqual(actual, expect, msg);


  msg    = 'must dispatch failure when an error occurred';
  mock   = {
    name: 'AA',
    open: 10,
    close: 20,
  };
  const err = 'Something bad happened...';
  expect = put({
    type: types.FETCH_LATEST_FAILED,
    error: err,
  });
  actual = iterator.throw(err).value;

  assert.deepEqual(actual, expect, msg);


  assert.ok(iterator.next().done, 'must finish');

  assert.end();
});


test('Watcher for search input saga', (assert) => {
  const iterator = searchWordChanged();
  let msg    = 'take action must competition with delay, and win initially';
  let expect = race({
    action: take(types.SEARCH_FOR),
    timeout: null,
  });
  let actual = iterator.next().value;

  assert.deepEqual(actual, expect, msg);


  msg    = 'must call handler right away with proper param';
  expect = fork(handleSearch, 'APPLE');
  actual = iterator.next({
    action: { word: 'APPLE' },
    timeout: null,
  }).value;

  assert.deepEqual(actual, expect, msg);


  msg    = 'must restart the race with timeout';
  actual = iterator.next().value.RACE.timeout.hasOwnProperty('CALL');

  assert.ok(actual, msg);


  msg      = 'must have a debouncing time that will not call handler immediately';
  const unexpect = fork(handleSearch, 'APPLE');
  actual   = iterator.next().value;

  assert.notDeepEqual(actual, unexpect, msg);

  assert.end();
});


test('Searching input handler saga', (assert) => {
  const mockWord = 'H';
  let iterator = handleSearch(mockWord);
  let msg      = 'must filter the result by searching word';
  let expect   = ['HD', 'HON', 'HP'];
  let actual   = iterator.next().value;

  assert.deepEqual(actual, expect, msg);


  msg      = 'must dispatch the filtered result';
  expect   = put(actions.gotSearchResult(['PPAP']));
  actual   = iterator.next(['PPAP']).value;

  assert.deepEqual(actual, expect, msg);


  msg      = 'must return the whole stock array if the input field was empty';
  iterator = handleSearch('');
  expect   = STOCKS;
  actual   = iterator.next(STOCKS).value;

  assert.deepEqual(actual, expect, msg);

  assert.end();
});
