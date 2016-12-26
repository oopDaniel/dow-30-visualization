/**
 * get: REST get request returning JSON object(s)
 * @param options: http options object
 * @returns Promise<json>
 */

import * as http  from 'http';
import * as https from 'https';

// import util from 'util';

import {
  RETRY_DURATION,
  RETRY_MAX_COUNT,
} from './../const';


export default function get(options, id = -1) {
  console.info('Making request...');
  const prot = options.port === 443
    ? https
    : http;

  return new Promise((resolve, reject) => {
    const req  = prot.request(options, (res) => {
      // console.log(util.inspect(res))
      console.log(`${options.host}: ${res.statusCode}`);

      // Too many requests
      if (res.statusCode === 429) {
        reject({
          id,
          statusCode: 429,
          result:     options,
          delay:      res.headers['x-ms-retry-after-ms'] || RETRY_DURATION,
        });
      }

      let output = '';

      res.setEncoding('utf8');
      res.on('data', (chunk) => {
        output += chunk;
      });

      res.on('end', () => {
        let obj;

        try {
          obj = JSON.parse(output);
        } catch (e) {
          console.error('Error resolve json', e);
          resolve({
            statusCode: -1,
            result:     e,
          });
        }

        resolve({
          statusCode: res.statusCode,
          result:     obj,
        });
      });
    });

    req.on('error', (e) => {
      reject({
        statusCode: -1,
        result:     e,
      });
    });
    req.end();
  })
  .then(
    data => data,
    handleRejection,
  );
}

const retryCounter = {};
const retry = (options, id) => {
  if (!retryCounter[id]) {
    retryCounter[id] = 1;
  } else {
    retryCounter[id] += 1;
  }

  return retryCounter[id] > RETRY_MAX_COUNT
    ? Promise.reject({
      statusCode: -1,
      result:     'API is inaccessible currently',
    })
    : get(options, id);
};

const handleRejection = reason => new Promise(
  (resolve, reject) => {
    if (reason.statusCode === 429) {
      setTimeout(
        () => resolve(retry(reason.result, reason.id)),
        reason.delay,
        );
    } else {
      reject({
        statusCode: -1,
        result:     'Unknown error',
      });
    }
  });

