export default (num, decimal = 2) => {
  const multiply = 10 ** decimal;
  return Math.round(num * multiply) / multiply;
};
