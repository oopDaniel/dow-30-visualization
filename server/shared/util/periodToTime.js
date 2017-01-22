export default (period, today = Date.now()) => {
  const time = today - (today % 86400000);
  const date = new Date(time);

  switch (period) {
    // 1 week
    case 1: {
      return date - (6 * 86400000);
    }

    // 1 month
    case 2: {
      date.setMonth(date.getUTCMonth() - 1);
      return Number(date);
    }

    // 3 month
    case 3: {
      date.setMonth(date.getUTCMonth() - 3);
      return Number(date);
    }

    // 6 month
    case 4: {
      date.setMonth(date.getUTCMonth() - 6);
      return Number(date);
    }

    // 1 year
    case 5: {
      date.setYear(date.getUTCYear() - 1);
      return Number(date);
    }

    default: {
      return today;
    }
  }
};
