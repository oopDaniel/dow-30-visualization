
export const FETCH_TODAY_REQUEST = 'FETCH_TODAY_REQUEST';
export const FETCH_TODAY_SUCCEEDED = 'FETCH_TODAY_SUCCEEDED';
export const FETCH_TODAY_FAILED = 'FETCH_TODAY_FAILED';
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

export function fetchTodayRequest(target) {
  return {
    type: FETCH_TODAY_REQUEST,
    target,
  };
}

export function fetchTodaySucceeded(payload) {
  return {
    type: FETCH_TODAY_SUCCEEDED,
    payload,
    receivedAt: Date.now(),
  };
}

export function fetchTodayFailed(error) {
  return {
    type: FETCH_TODAY_FAILED,
    error,
    receivedAt: Date.now(),
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
