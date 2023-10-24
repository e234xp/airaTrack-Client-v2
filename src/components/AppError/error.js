import { reactive } from 'vue';

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
  ?? error?.message
  ?? 'Something went wrong';

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
