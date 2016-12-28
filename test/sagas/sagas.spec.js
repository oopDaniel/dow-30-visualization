/* eslint-disable no-unused-vars, no-constant-condition,
  import/no-extraneous-dependencies, no-multi-spaces,
  padded-blocks */

import test from 'tape';
import { takeLatest } from 'redux-saga';
import { call, put, select, take, fork } from 'redux-saga/effects';
import * as actions from './../../src/actions';
import { focusedBySelector } from './../../src/reducers/selectors';
import * as types from './../../src/consts/actionTypes';
import api from './../../src/services/API';
import { loadState, saveState } from './../../src/services/localStorage';
import {
  // watchFetchLatest,
  init,
  nextFocusedChange,
  fetchLatest,
} from './../../src/sagas/sagas';


// const before = test;
// const after  = test;
// let   backup = null;


// before(' - Saga Before - ', (assert) => {
//   backup = loadState();
//   assert.pass('Backuping localStorage...');
//   assert.end();
// });


test('Initial state saga', (assert) => {
  const iterator = init();
  let msg    = 'must call localStorage API';
  let expect = call(loadState);
  let actual = iterator.next().value;

  assert.deepEqual(actual, expect, msg);

  msg    = 'delegate to fetchLatest with the API result';
  expect = fork(fetchLatest, ['PINEAPPLE', 'PEN']);
  actual = iterator.next('PINEAPPLE,PEN').value;

  assert.deepEqual(actual, expect, msg);


  const mock = ['PINEAPPLE', 'PEN'];
  const getMock = () => (mock);
  msg    = 'must init the focused using either API result or predefined data';
  expect = put(actions.loadPersisted(mock));
  actual = iterator.next(getMock()).value;

  assert.deepEqual(actual, expect, msg);

  assert.end();
});


test('Watcher saga for changes of the focused', (assert) => {
  const iterator = nextFocusedChange();
  let msg    = 'must take either ADD_FOCUS or REMOVE_FOCUS action';
  let expect = take([types.ADD_FOCUS, types.REMOVE_FOCUS]);
  let actual = iterator.next().value;

  assert.deepEqual(actual, expect, msg);


  msg    = 'must select the new change of the focused';
  expect = select(focusedBySelector);
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


// after(' - Saga After - ', (assert) => {
//   if (backup) saveState(backup);
//   assert.pass('Restoring localStorage...');
//   assert.end();
// });


// test('Watcher for fetching \'latest\' request saga', (assert) => {
//   const iterator = watchFetchLatest();
//   const msg      = 'must take every \'latest\' request and call fetching func';
//   const expect   = call(takeLatest, types.FETCH_LATEST_REQUEST, fetchLatest);
//   const actual   = iterator.next().value;

//   assert.deepEqual(actual, expect, msg);
//   assert.end();
// });


// test('Watcher for changes of the focused', (assert) => {
//   const iterator = nextFocusedChange();
//   let msg    = 'must select the change of the focused';
//   let expect = select(focusedBySelector);
//   let actual = iterator.next().value;

//   assert.deepEqual(actual, expect, msg);


//   msg    = 'must take an ADD_FOCUS action';
//   expect = take(types.ADD_FOCUS);
//   actual = iterator.next(['APPLE']).value;

//   assert.deepEqual(actual, expect, msg);


//   msg    = 'must select the new change of the focused';
//   expect = select(focusedBySelector);
//   actual = iterator.next().value;

//   assert.deepEqual(actual, expect, msg);


//   msg    = 'delegate to fetchLatest for new stocks in the focused';
//   expect = fork(fetchLatest, ['APPLE', 'PEN']);
//   actual = iterator.next(['APPLE', 'PEN']).value;
//   assert.deepEqual(actual, expect, msg);

//   assert.end();
// });
