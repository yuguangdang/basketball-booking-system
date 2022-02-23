const currentWeekNumber = require("current-week-number");

const getSundayFromWeekNum = (weekNum = currentWeekNumber(), year = new Date().getFullYear()) => {
  const sunday = new Date(year, 0, 1 + (weekNum + 1) * 7);
  while (sunday.getDay() !== 0) {
    sunday.setDate(sunday.getDate() - 1);
  }
  return sunday.toDateString();
};

module.exports = getSundayFromWeekNum;