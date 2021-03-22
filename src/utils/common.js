export const capitalize = (s) => {
  if (typeof s !== "string") return "";
  return s.charAt(0).toUpperCase() + s.slice(1);
};

export const convertTimestampToDatetime = (unix_timestamp) => {
  return new Date(unix_timestamp);
};