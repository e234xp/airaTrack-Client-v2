import { reactive } from 'vue';

const successObject = reactive({
  isShow: false,
  body: '',

  show,
  close,
});

let timeoutID;
function show(i18nText = 'Successful') {
  successObject.isShow = true;
  successObject.body = i18nText;

  clearTimeout(timeoutID);
  timeoutID = setTimeout(() => {
    close();
  }, 3 * 1000);
}

function close() {
  clearTimeout(timeoutID);
  successObject.isShow = false;
}

export default successObject;
