const AppError = require("./appError");
const moment = require("moment");
module.exports = function (bakingTime, next) {
  const bakingTimeHours = bakingTime.hours || 0;
  const bakingTimeMinutes = bakingTime.minutes || 0;

  // assuming that no cake take more than 4 hours for baking
  if (
    bakingTimeHours < 0 ||
    bakingTimeHours > 4 ||
    bakingTimeMinutes < 0 ||
    bakingTimeMinutes > 59
  )
    next(new AppError("Invalid bake time", 422));

  return {
    startTime: moment().format("HH:mm"),
    endTime: moment()
      .add(bakingTimeHours || 1, "hours")
      .add(bakingTimeMinutes || 0, "minutes")
      .format("HH:mm"),
  };
};
