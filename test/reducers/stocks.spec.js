/* eslint-disable no-unused-vars, no-constant-condition,
  import/no-extraneous-dependencies, no-multi-spaces,
  padded-blocks, key-spacing */
import test from 'tape';
import stocks from './../../src/reducers/stocks';
import {
  FETCH_LATEST_REQUEST,
  FETCH_LATEST_SUCCEEDED,
  FETCH_LATEST_FAILED,
} from './../../src/consts/actionTypes';


test('Stock reducer', (assert) => {
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


  let msg = 'must insert the brand new stock into the stockList';
  let expect = { APPLEPEN: [record] };
  let actual = stocks(undefined, { type: FETCH_LATEST_SUCCEEDED, response });

  assert.deepEqual(actual, expect, msg);


  msg = 'must insert the different record into proper place';
  expect = {
    APPLEPEN:     [record],
    PINEAPPLEPEN: [record],
  };
  actual = stocks(actual, {
    type: FETCH_LATEST_SUCCEEDED,
    response: response2,
  });

  assert.deepEqual(actual, expect, msg);


  msg = 'must proccess record with identical name correctly';
  expect = { APPLEPEN: [record, record2], PINEAPPLEPEN: [record] };
  actual = stocks(actual, {
    type: FETCH_LATEST_SUCCEEDED,
    response: response3,
  });

  assert.deepEqual(actual, expect, msg);
  assert.end();
});

test('Latest reducer: FETCH_LATEST_FAILED', (assert) => {
  const prev   = { PEN: [] };

  const msg    = 'must keep the previous state';
  const expect = prev;
  const actual = stocks(prev, { type: FETCH_LATEST_FAILED });

  assert.deepEqual(actual, expect, msg);
  assert.end();
});
