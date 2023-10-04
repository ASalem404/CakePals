exports.isBusy = (busyTimes, collectionTime) => {
  return isBakerBusy(busyTimes, collectionTime);
};

function isBakerBusy(busyTimes, queryTimeRange) {
  for (const { startTime, endTime } of busyTimes) {
    // Parse start and end times into Date objects
    const startDateTime = new Date(`2023-10-05T${startTime}`);
    const endDateTime = new Date(`2023-10-05T${endTime}`);

    // Parse query start and end times into Date objects
    const queryStartDateTime = new Date(
      `2023-10-05T${queryTimeRange.startTime}`
    );
    const queryEndDateTime = new Date(`2023-10-05T${queryTimeRange.endTime}`);

    // Check for overlap
    if (
      queryStartDateTime <= endDateTime &&
      queryEndDateTime >= startDateTime
    ) {
      return true; // Baker is busy during this time
    }
  }

  return false; // Baker is not busy during this time
}
