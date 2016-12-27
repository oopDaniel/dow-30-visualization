
export const oneMonth   = 'ONE_MONTH';
export const threeMonth = 'THREE_MONTHS';
export const sixMonth   = 'SIX_MONTHS';
export const oneYear    = 'ONE_YEAR';

const periodEnum = {
  0: oneMonth,
  1: threeMonth,
  2: sixMonth,
  3: oneYear,
  [oneMonth]: 0,
  [threeMonth]: 1,
  [sixMonth]: 2,
  [oneYear]: 3,
};

export default periodEnum;
