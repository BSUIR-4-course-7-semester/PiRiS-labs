import moment = require("moment");

export const DATE_INPUT_FORMAT = 'YYYY-MM-DD';

export function formatDate(date, format = DATE_INPUT_FORMAT) {
  return moment(date).format(format);
}

export function today() {
  return moment();
}
