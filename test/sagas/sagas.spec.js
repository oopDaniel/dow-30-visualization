/* eslint-disable no-unused-vars, no-constant-condition,
  import/no-extraneous-dependencies, no-multi-spaces,
  padded-blocks */

import test from 'tape';
import { takeLatest } from 'redux-saga';
import { call, put } from 'redux-saga/effects';
import * as actions from './../../src/actions';
import * as types from './../../src/consts/actionTypes';
import api from './../../src/services';
import {
  watchFetchLatest,
  fetchLatest,
} from './../../src/sagas/sagas';


test('watcher for fetching \'latest\' request saga', (assert) => {
  const iterator = watchFetchLatest();
  const expect   = call(takeLatest, types.FETCH_LATEST_REQUEST, fetchLatest);
  const actual   = iterator.next().value;
  const msg      = 'must take every \'latest\' request and call fetching func';

  assert.deepEqual(actual, expect, msg);
  assert.end();
});


test('fetching \'latest\' saga', (assert) => {

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
  const err = 'something bad happened...';
  expect = put({
    type: types.FETCH_LATEST_FAILED,
    error: err,
  });
  actual = iterator.throw(err).value;

  assert.deepEqual(actual, expect, msg);


  assert.ok(iterator.next().done, 'must finish');


  assert.end();
});
