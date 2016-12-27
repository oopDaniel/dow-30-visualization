/* eslint-disable no-unused-vars, no-constant-condition,
  import/no-extraneous-dependencies, no-multi-spaces,
  padded-blocks, key-spacing */
import test from 'tape';
import latest from './../../src/reducers/latest';
import {
  FETCH_LATEST_REQUEST,
  FETCH_LATEST_SUCCEEDED,
  FETCH_LATEST_FAILED,
} from './../../src/consts/actionTypes';


test('Latest reducer: FETCH_LATEST_REQUEST', (assert) => {
  const msg    = 'must set isFetching to true when requesting for the latest';
  const expect = true;
  const actual = latest(undefined, { type: FETCH_LATEST_REQUEST }).isFetching;

  assert.equal(actual, expect, msg);
  assert.end();
});


test('Latest reducer: FETCH_LATEST_SUCCEEDED', (assert) => {
  const prev      = { isFetching: true, stocks: {} };
  const timestamp = Date.now();
  const record    = {
    Open:   123,
    Close:  124,
    High:   200,
    Low:    100,
    Volume: 10,
    Date:   timestamp,
  };
  const record2   = {
    Open:   200,
    Close:  200,
    High:   200,
    Low:    200,
    Volume: 200,
    Date:   timestamp + 1,
  };
  const newStock  = 'APPLEPEN';
  const newStock2 = 'PINEAPPLEPEN';
  const response  = [{ ...record, Name: newStock }];
  const response2 = [{ ...record, Name: newStock2 }];
  const response3 = [{ ...record2, Name: newStock }];


  let msg = 'must set isFetching to false after fetching';
  let expect = false;
  let actual = latest(prev, { type: FETCH_LATEST_SUCCEEDED, response }).isFetching;

  assert.equal(actual, expect, msg);


  msg = 'must insert the brand new stock into the stockList';
  expect = { APPLEPEN: [record] };
  let afterSuccess = latest(undefined, { type: FETCH_LATEST_SUCCEEDED, response });
  actual = afterSuccess.stocks;

  assert.deepEqual(actual, expect, msg);


  msg = 'must insert the different record into proper place';
  expect = {
    APPLEPEN:     [record],
    PINEAPPLEPEN: [record],
  };
  afterSuccess = latest(afterSuccess, {
    type: FETCH_LATEST_SUCCEEDED,
    response: response2,
  });
  actual = afterSuccess.stocks;

  assert.deepEqual(actual, expect, msg);


  msg = 'must proccess record with identical name correctly';
  expect = { APPLEPEN: [record, record2], PINEAPPLEPEN: [record] };
  actual = latest(afterSuccess, {
    type: FETCH_LATEST_SUCCEEDED,
    response: response3,
  }).stocks;

  assert.deepEqual(actual, expect, msg);
  assert.end();
});

test('Latest reducer: FETCH_LATEST_FAILED', (assert) => {
  const prev      = { isFetching: true, stocks: { HELLO: [] } };


  let msg    = 'must set isFetching to false after fetching';
  let expect = false;
  let actual = latest(prev, { type: FETCH_LATEST_FAILED }).isFetching;

  assert.equal(actual, expect, msg);


  msg    = 'must keep the previous state';
  expect = { ...prev, isFetching: false };
  actual = latest(prev, { type: FETCH_LATEST_FAILED });

  assert.deepEqual(actual, expect, msg);
  assert.end();
});
