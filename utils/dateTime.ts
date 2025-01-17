
export const convertToBrowserTimezone = (utcTime: string): string => {
  if (!utcTime) {
    return '';
  }

  // Create a Date object for today's date with the given UTC time
  const utcDate = new Date(`1970-01-01T${utcTime}Z`);
  // Convert to local time
  return utcDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};
