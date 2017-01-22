/* eslint-disable space-in-parens */
import fetch from 'isomorphic-fetch';

let url;
try {
  url = document.location.href;
} catch (e) {
  url = 'http://localhost:3000/';
}

const API = {
  getLatest(target) {
    const param = Array.isArray(target)
      ? `?target=${target.join(',')}`
      : '';

    return fetch(`${url}api/latest${param}`)
      .then( response => response.json() )
      .catch( error => ({ error }) );
  },

  getTrend(target, period) {
    const param = Array.isArray(target)
      ? `?target=${target.join(',')}`
      : '';

    return fetch(`${url}api/trend${param}&period=${period}`)
      .then( response => response.json() )
      .catch( error => ({ error }) );
  },
};

export default API;
