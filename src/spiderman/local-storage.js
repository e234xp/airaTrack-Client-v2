function set(key, value) {
  const stringValue = JSON.stringify(value);
  window.localStorage.setItem(key, stringValue);
}

function get(key) {
  const value = window.localStorage.getItem(key);
  const parsedValue = JSON.parse(value);
  return parsedValue;
}

export default {
  set,
  get,
};
