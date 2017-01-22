
export const today      = 'Today';
export const oneWeek    = '1 week';
export const oneMonth   = '1 month';
export const threeMonth = '3 months';
export const sixMonth   = '6 months';
export const oneYear    = '1 year';

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
