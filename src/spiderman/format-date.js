import dayjs from 'dayjs';

const userLocale = navigator.language || navigator.userLanguage;
const opt = Intl.DateTimeFormat().resolvedOptions();

function today() {
  return Intl.DateTimeFormat(userLocale, { dateStyle: 'medium'}).format(dayjs().toDate());
  // return dayjs().toDate().toLocaleDateString(userLocale, opt);
}

function parseYMD(date) {
  return parse(date, { dateStyle: 'medium' });
}

function parseMD(date) {
  const { month, day } = opt;
  return parse(date, { month, day });
}

function parse(date, option) {
  // console.log(opt);
  // const option = list ? list.reduce((obj, key) => {
  //   obj[key] = opt[key];
  //   return obj;
  // }, {}) : opt;
  const tempDate = typeof date === 'string' || typeof date === 'number' ? dayjs(date) : date;
  return Intl.DateTimeFormat(userLocale, option).format(tempDate.toDate());
  // return tempDate.toDate().toLocaleDateString(userLocale, { dateStyle: 'full'});
}

export default {
  today,
  parseYMD,
  parseMD,
  parse
};