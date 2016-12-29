/* eslint-disable no-unused-vars, no-constant-condition,
  import/no-extraneous-dependencies, no-multi-spaces,
  padded-blocks, key-spacing */
import test from 'tape';
import search from './../../src/reducers/search';
import {
  GOT_SEARCHED_RESULT,
  BEGIN_SEARCHING,
  END_SEARCHING,
} from './../../src/consts/actionTypes';


test('Search reducer', (assert) => {
  let msg    = 'must handle GOT_SEARCHED_RESULT';
  let expect = ['PEN', 'PINEAPPLE'];
  let actual = search(undefined, {
    type: GOT_SEARCHED_RESULT,
    result: ['PEN', 'PINEAPPLE'],
  }).options;

  assert.deepEqual(actual, expect, msg);


  msg    = 'must init the isSearching status';
  expect = true;
  actual = search(undefined, { type: BEGIN_SEARCHING }).isSearching;

  assert.equal(actual, expect, msg);


  msg    = 'must handle the isSearching status after searching ends';
  expect = false;
  actual = search(undefined, { type: END_SEARCHING }).isSearching;

  assert.equal(actual, expect, msg);

  assert.end();
});
