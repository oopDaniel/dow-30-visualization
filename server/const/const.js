export const DOW30 = [
    'AA',
    'AXP',
    'BA',
    // 'C',
    // 'CAT',
    // 'DD',
    // 'DIS',
    // 'EK',
    // 'GE',
    // 'GM',
    // 'HD',
    // 'HON',
    // 'HP',
    // 'IBM',
    // 'INTC',
    // 'IP',
    // 'JNJ',
    // 'JPM',
    // 'KO',
    // 'MCD',
    // 'MMM',
    // 'MO',
    // 'MRK',
    // 'MSFT',
    // 'PG',
    // 'SBC',
    // 'T',
    // 'UTX',
    // 'WMT',
    // 'XOM',
];


/**
 *          The complete url: END_POINT + API_URL + companyID + API_POSTFIX
 */
export const END_POINT   = 'www.quandl.com' 
export const API_URL     = `/api/v3/datasets/WIKI/`;
export const API_POSTFIX = '/data.json';


/**
 *          HTTP Request
 */
export const RETRY_DURATION  = 5000;
export const RETRY_MAX_COUNT = 10;