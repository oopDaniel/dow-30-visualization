
export const FETCH_LATEST_REQUEST = 'FETCH_LATEST_REQUEST';
export const FETCH_LATEST_SUCCEEDED = 'FETCH_LATEST_SUCCEEDED';
export const FETCH_LATEST_FAILED = 'FETCH_LATEST_FAILED';
export const FETCH_TREND_REQUEST = 'FETCH_TREND_REQUEST';
export const FETCH_TREND_SUCCEEDED = 'FETCH_TREND_SUCCEEDED';
export const FETCH_TREND_FAILED = 'FETCH_TREND_FAILED';
export const ADD_STOCK = 'ADD_STOCK';
export const REMOVE_STOCK = 'REMOVE_STOCK';
export const SWITCH_PERIOD = 'SWITCH_PERIOD';
// export const SEARCH = 'SEARCH';

export function switchPeriod(period) {
  return {
    type: SWITCH_PERIOD,
    period,
  };
}

export function addStock(target) {
  return {
    type: ADD_STOCK,
    target,
  };
}

export function removeStock(target) {
  return {
    type: REMOVE_STOCK,
    target,
  };
}

export function fetchLatestRequest(target) {
  return {
    type: FETCH_LATEST_REQUEST,
    target,
  };
}

export function fetchLatestSucceeded(response) {
  return {
    type: FETCH_LATEST_SUCCEEDED,
    response,
    // receivedAt: Date.now(),
  };
}

export function fetchLatestFailed(error) {
  return {
    type: FETCH_LATEST_FAILED,
    error,
    // receivedAt: Date.now(),
  };
}

export function fetchTrendRequest(target, period) {
  return {
    type: FETCH_TREND_REQUEST,
    target,
    period,
  };
}

export function fetchTrendSucceeded(payload) {
  return {
    type: FETCH_TREND_SUCCEEDED,
    payload,
    receivedAt: Date.now(),
  };
}

export function fetchTrendFailed(error) {
  return {
    type: FETCH_TREND_FAILED,
    error,
    receivedAt: Date.now(),
  };
}
