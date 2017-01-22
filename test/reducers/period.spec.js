/* eslint-disable no-unused-vars, no-constant-condition,
  import/no-extraneous-dependencies, no-multi-spaces,
  padded-blocks, key-spacing */
import test from 'tape';
import period from './../../src/reducers/period';
import { SWITCH_PERIOD } from './../../src/consts/actionTypes';
import { GetPeriodByName, today, sixMonth } from './../../src/consts/periodEnum';


test('Period reducer', (assert) => {
  let msg    = 'must return an initial period with 1 day';
  let expect = GetPeriodByName[today];
  let actual = period(undefined, { type: '' });

  assert.equal(actual, expect, msg);


  msg    = 'must handle SWITCH_PERIOD';
  expect = GetPeriodByName[sixMonth];
  actual = period(undefined, {
    type: SWITCH_PERIOD,
    period: GetPeriodByName[sixMonth],
  });

  assert.equal(actual, expect, msg);
  assert.end();
});

