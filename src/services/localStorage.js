/* eslint-disable space-in-parens */

export const loadState = () => {
  try {
    const prevState = localStorage.getItem('state');
    if (prevState === null) {
      return undefined;
    }
    return JSON.parse(prevState);
  } catch (err) {
    return undefined;
  }
};

export const saveState = (state) => {
  try {
    const curState = JSON.stringify(state);
    localStorage.setItem('state', curState);
  } catch (err) {
    // Do nothing
  }
};
