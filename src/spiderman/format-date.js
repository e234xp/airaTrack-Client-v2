import dayjs from 'dayjs';

const userLocale = navigator.language || navigator.userLanguage;
const opt = Intl.DateTimeFormat().resolvedOptions();

function today() {
  return dayjs().toDate().toLocaleDateString(userLocale, opt);
}

function parseStr(dateStr, list) {
  const option = list.reduce((obj, key) => {
    obj[key] = opt[key];
    return obj;
  }, {});
  return dayjs(dateStr).toDate().toLocaleDateString(userLocale, option);
}

function parse(date, list) {
  const option = list ? list.reduce((obj, key) => {
    obj[key] = opt[key];
    return obj;
  }, {}) : opt;
  const tempDate = typeof date === 'string' || typeof date === 'number' ? dayjs(date) : date;
  return tempDate.toDate().toLocaleDateString(userLocale, option);
}

export default {
  today,
  parseStr,
  parse
};