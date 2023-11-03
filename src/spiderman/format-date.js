import dayjs from 'dayjs';

const userLocale = navigator.language || navigator.userLanguage;

function today() {
  return dayjs().toDate().toLocaleDateString(userLocale);
}

function parseStr(dateStr, md = {}) {
  return dayjs(dateStr).toDate().toLocaleDateString(userLocale, md);
}

function parse(date, md = {}) {
  return date.toDate().toLocaleDateString(userLocale, md);
}

export default {
  today,
  parseStr,
  parse
};