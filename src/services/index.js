/* eslint-disable space-in-parens */
import fetch from 'isomorphic-fetch';

const API = {
  getLatest(target) {
    const param = Array.isArray(target)
      ? `?target=${target.join(',')}`
      : '';
    let url;
    try {
      url = document.location.href;
    } catch (e) {
      url = 'http://localhost:3000/';
    }

    return fetch(`${url}api/latest${param}`)
      .then( response => ({ response: response.json() }) )
      .catch( error => ({ error }) );
  },
};

export default API;
