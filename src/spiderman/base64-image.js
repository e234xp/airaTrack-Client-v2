function getSrc(base64) {
  return `data:image/png;base64, ${base64}`;
}

function getStyle(base64) {
  return `url('data:image/png;base64, ${base64}')`;
}

function getUnknowSrc(base64) {
  return `${base64}`;
}

export default {
  getSrc,
  getStyle,
  getUnknowSrc,
};
