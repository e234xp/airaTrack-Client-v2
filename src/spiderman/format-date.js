import dayjs from 'dayjs';

const userLocale = navigator.language || navigator.userLanguage;
const opt = Intl.DateTimeFormat().resolvedOptions();

function today() {
  return Intl.DateTimeFormat(userLocale, { dateStyle: 'medium'}).format(dayjs().toDate());
}

function parseYMD(date) {
  return parse(date, { dateStyle: 'medium' });
}

function parseMD(date) {
  const { month, day } = opt;
  return parse(date, { month, day });
}

function parse(date, option) {
  const tempDate = typeof date === 'string' || typeof date === 'number' ? dayjs(date) : date;
  return Intl.DateTimeFormat(userLocale, option).format(tempDate.toDate());
}

export default {
  today,
  parseYMD,
  parseMD,
  parse
};