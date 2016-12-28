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
  };
  const record2   = {
    Open:   200,
    Close:  200,
    High:   200,
    Low:    200,
    Volume: 200,
  };
  const newStock  = 'APPLEPEN';
  const newStock2 = 'PINEAPPLEPEN';
  const response  = [{ ...record, Name: newStock, Date: timestamp }];
  const response2 = [{ ...record, Name: newStock2, Date: timestamp }];
  const response3 = [{ ...record2, Name: newStock, Date: timestamp + 1 }];


  let msg       = 'must insert the brand new stock into the stock::byName';
  let processed = stocks(undefined, { type: FETCH_LATEST_SUCCEEDED, response });
  let expect    = {
    APPLEPEN: {
      latest: [timestamp, timestamp],
      data: { [timestamp]: record },
    },
  };
  let actual    = processed.byName;

  assert.deepEqual(actual, expect, msg);


  msg    = 'must insert the brand new stock into the stock::allNames';
  expect = ['APPLEPEN'];
  actual = processed.allNames;

  assert.deepEqual(actual, expect, msg);


  msg       = 'must insert the different record into proper place (byName)';
  expect    = {
    APPLEPEN: {
      latest: [timestamp, timestamp],
      data: { [timestamp]: record },
    },
    PINEAPPLEPEN: {
      latest: [timestamp, timestamp],
      data: { [timestamp]: record },
    },
  };
  processed = stocks(processed, {
    type: FETCH_LATEST_SUCCEEDED,
    response: response2,
  });
  actual    = processed.byName;

  assert.deepEqual(actual, expect, msg);


  msg       = 'must insert the different record into proper place (allNames)';
  expect    = ['APPLEPEN', 'PINEAPPLEPEN'];
  actual    = processed.allNames;

  assert.deepEqual(actual, expect, msg);


  msg       = 'must proccess record with identical name correctly (byName)';
  expect    = {
    APPLEPEN: {
      latest: [timestamp, timestamp + 1],
      data: {
        [timestamp]: record,
        [timestamp + 1]: record2,
      },
    },
    PINEAPPLEPEN: {
      latest: [timestamp, timestamp],
      data: {
        [timestamp]: record,
      },
    },
  };
  processed = stocks(processed, {
    type: FETCH_LATEST_SUCCEEDED,
    response: response3,
  });
  actual    = processed.byName;

  assert.deepEqual(actual, expect, msg);


  msg    = 'must proccess record with identical name correctly (allNames)';
  expect = ['APPLEPEN', 'PINEAPPLEPEN'];
  actual = processed.allNames;

  assert.deepEqual(actual, expect, msg);

  assert.end();
});

test('Latest reducer: FETCH_LATEST_FAILED', (assert) => {
  const prev   = { allNames: ['PEN'], byName: { PEN: [] } };

  const msg    = 'must keep the previous state';
  const expect = prev;
  const actual = stocks(prev, { type: FETCH_LATEST_FAILED });

  assert.deepEqual(actual, expect, msg);
  assert.end();
});
