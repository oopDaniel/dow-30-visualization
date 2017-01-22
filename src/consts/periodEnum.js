
export const today      = 'TODAY';
export const oneWeek    = 'ONE_WEEK';
export const oneMonth   = 'ONE_MONTH';
export const threeMonth = 'THREE_MONTHS';
export const sixMonth   = 'SIX_MONTHS';
export const oneYear    = 'ONE_YEAR';

const periodEnum = {
  0: today,
  1: oneWeek,
  2: oneMonth,
  3: threeMonth,
  4: sixMonth,
  5: oneYear,
  [today]: 0,
  [oneWeek]: 1,
  [oneMonth]: 2,
  [threeMonth]: 3,
  [sixMonth]: 4,
  [oneYear]: 5,
};

export default periodEnum;
