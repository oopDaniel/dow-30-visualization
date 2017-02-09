
export const today      = 'Today';
export const oneWeek    = '1 week';
export const oneMonth   = '1 month';
export const threeMonth = '3 months';
export const sixMonth   = '6 months';
export const oneYear    = '1 year';

export const GetNameByPeriod = {
  0: today,
  1: oneWeek,
  2: oneMonth,
  3: threeMonth,
  4: sixMonth,
  5: oneYear,
};

export const GetPeriodByName = {
  [today]: 0,
  [oneWeek]: 1,
  [oneMonth]: 2,
  [threeMonth]: 3,
  [sixMonth]: 4,
  [oneYear]: 5,
};

// The count of ticks in x-axis
export const GetTicksByPeriod = {
  0: 1,
  1: 7,
  2: 7,
  3: 12,
  4: 12,
  5: 12,
};

const periodEnum = {
  ...GetPeriodByName,
  ...GetNameByPeriod,
};

export default periodEnum;
