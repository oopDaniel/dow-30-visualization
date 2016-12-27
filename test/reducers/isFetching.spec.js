/* eslint-disable no-unused-vars, no-constant-condition,
  import/no-extraneous-dependencies, no-multi-spaces,
  padded-blocks, key-spacing */
import test from 'tape';
import isFetching from './../../src/reducers/isFetching';
import {
  FETCH_LATEST_REQUEST,
  FETCH_LATEST_SUCCEEDED,
  FETCH_LATEST_FAILED,
} from './../../src/consts/actionTypes';


test('IsFetching reducer', (assert) => {
  let msg    = 'must be set to true for FETCH_LATEST_REQUEST';
  let expect = true;
  let actual = isFetching(undefined, { type: FETCH_LATEST_REQUEST });

  assert.equal(actual, expect, msg);


  msg    = 'must be set to false for FETCH_LATEST_SUCCEEDED';
  expect = false;
  actual = isFetching(true, { type: FETCH_LATEST_SUCCEEDED });

  assert.equal(actual, expect, msg);


  msg    = 'must be set to false for FETCH_LATEST_FAILED';
  expect = false;
  actual = isFetching(true, { type: FETCH_LATEST_FAILED });

  assert.equal(actual, expect, msg);
  assert.end();
});
