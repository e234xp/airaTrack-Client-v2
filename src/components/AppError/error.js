import { reactive } from 'vue';

import modalStore from '@/components/AppModal/modal';

const errorObject = reactive({
  isShow: false,
  header: '',
  body: '',

  show,
  close,
});

let timeoutID;
function show({ title: theTitle = '', error }) {
  errorObject.isShow = true;
  errorObject.title = theTitle;
  errorObject.body = error?.response?.data.message
  ?? error?.response?.data.error_info
  ?? error?.message
  ?? 'Something went wrong';

  if (errorObject.body.indexOf('expired') >= 0 && !modalStore.isOpen) {
    modalStore.relogin();
  }

  clearTimeout(timeoutID);
  timeoutID = setTimeout(() => {
    close();
  }, 3 * 1000);
}

function close() {
  clearTimeout(timeoutID);
  errorObject.isShow = false;
}

export default errorObject;
