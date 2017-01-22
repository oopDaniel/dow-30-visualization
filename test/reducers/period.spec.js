/* eslint-disable no-unused-vars, no-constant-condition,
  import/no-extraneous-dependencies, no-multi-spaces,
  padded-blocks, key-spacing */
import test from 'tape';
import period from './../../src/reducers/period';
import { SWITCH_PERIOD } from './../../src/consts/actionTypes';
import PERIOD, { today, sixMonth } from './../../src/consts/periodEnum';


test('Period reducer', (assert) => {
  let msg         = 'must return an initial period with 1 day';
  let expect      = today;
  let returnIndex = period(undefined, { type: '' });
  let actual      = PERIOD[returnIndex];

  assert.equal(actual, expect, msg);


  msg         = 'must handle SWITCH_PERIOD';
  expect      = sixMonth;
  returnIndex = period(undefined, {
    type: SWITCH_PERIOD,
    period: sixMonth,
  });
  actual      = PERIOD[returnIndex];

  assert.equal(actual, expect, msg);
  assert.end();
});

