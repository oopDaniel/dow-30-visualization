/**
 * Convert date string into timestamp
 * @param <string> timeStr - e.g. '2015-12-08'
 * @return <number> timestamp - e.g. 1449504000000
 */

export default function(timeStr) {
  let time = timeStr.split('-');
  /// Month begins with 0
  time[1] -= 1;
  return Number(new Date(time));
}
