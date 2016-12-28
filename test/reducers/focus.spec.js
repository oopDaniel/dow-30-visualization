/* eslint-disable no-unused-vars, no-constant-condition,
  import/no-extraneous-dependencies, no-multi-spaces,
  padded-blocks */
import test from 'tape';
import focus from './../../src/reducers/focus';
import { ADD_FOCUS, REMOVE_FOCUS } from './../../src/consts/actionTypes';


test('Stock reducer', (assert) => {
  const msg    = 'must return an empty array initially';
  const expect = [];
  const actual = focus(undefined, '');

  assert.deepEqual(actual, expect, msg);
  assert.end();
});


test('Stock reducer: ADD_FOCUS', (assert) => {
  let msg    = 'must handle ADD_FOCUS';
  let mock   = 'PP';
  let expect = [mock];
  let actual = focus([], {
    type: ADD_FOCUS,
    target: mock,
  });

  assert.deepEqual(actual, expect, msg);


  msg    = 'must ignore the duplicate stock';
  mock   = 'PP';
  expect = [mock];
  actual = focus(['PP'], {
    type: ADD_FOCUS,
    target: mock,
  });

  assert.deepEqual(actual, expect, msg);


  msg    = 'must NOT mutate the original array';
  mock   = 'AP';
  expect = actual.concat(mock);
  actual = focus(actual, {
    type: ADD_FOCUS,
    target: mock,
  });

  assert.notEqual(actual, expect, msg);
  assert.end();
});


test('Stock reducer: REMOVE_FOCUS', (assert) => {
  let msg      = 'must handle REMOVE_FOCUS';
  const mock   = ['PEN', 'PINEAPPLE'];
  let expect   = ['PINEAPPLE'];
  let actual   = focus(mock, {
    type: REMOVE_FOCUS,
    target: 'PEN',
  });

  assert.deepEqual(actual, expect, msg);


  msg    = 'must return [] if removing stock from an empty array';
  expect = [];
  actual = focus([], {
    type: REMOVE_FOCUS,
    target: 'APPLE',
  });

  assert.deepEqual(actual, expect, msg);
  assert.end();
});

