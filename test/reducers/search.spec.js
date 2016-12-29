/* eslint-disable no-unused-vars, no-constant-condition,
  import/no-extraneous-dependencies, no-multi-spaces,
  padded-blocks, key-spacing */
import test from 'tape';
import search from './../../src/reducers/search';
import {
  GOT_SEARCHED_RESULT,
  OPEN_SEARCHBAR,
  CLOSE_SEARCHBAR,
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
  actual = search(undefined, { type: OPEN_SEARCHBAR }).isSearching;

  assert.equal(actual, expect, msg);


  msg    = 'must set searching status to false after searching ends';
  expect = false;
  actual = search(undefined, { type: CLOSE_SEARCHBAR }).isSearching;

  assert.equal(actual, expect, msg);


  msg    = 'must clean the search field up';
  expect = '';
  actual = search(undefined, { type: CLOSE_SEARCHBAR }).word;

  assert.equal(actual, expect, msg);

  assert.end();
});
