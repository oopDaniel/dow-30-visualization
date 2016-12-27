import * as types from './../consts/actionTypes';

export function switchPeriod(period) {
  return {
    type: types.SWITCH_PERIOD,
    period,
  };
}

export function addStock(target) {
  return {
    type: types.ADD_STOCK,
    target,
  };
}

export function removeStock(target) {
  return {
    type: types.REMOVE_STOCK,
    target,
  };
}

export function fetchLatestRequest(target) {
  return {
    type: types.FETCH_LATEST_REQUEST,
    target,
  };
}

export function fetchLatestSucceeded(response) {
  return {
    type: types.FETCH_LATEST_SUCCEEDED,
    response,
    // receivedAt: Date.now(),
  };
}

export function fetchLatestFailed(error) {
  return {
    type: types.FETCH_LATEST_FAILED,
    error,
    // receivedAt: Date.now(),
  };
}

export function fetchTrendRequest(target, period) {
  return {
    type: types.FETCH_TREND_REQUEST,
    target,
    period,
  };
}

export function fetchTrendSucceeded(payload) {
  return {
    type: types.FETCH_TREND_SUCCEEDED,
    payload,
    receivedAt: Date.now(),
  };
}

export function fetchTrendFailed(error) {
  return {
    type: types.FETCH_TREND_FAILED,
    error,
    receivedAt: Date.now(),
  };
}
