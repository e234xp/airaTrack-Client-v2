import { ref } from 'vue';
import { defineStore } from 'pinia';

export default defineStore('error', () => {
  const isShow = ref(false);
  const title = ref('');
  const body = ref('');

  let timeoutID;
  function show({ title: theTitle = '', error }) {
    isShow.value = true;
    title.value = theTitle;
    body.value = error?.response?.data.message
    ?? error.message
    ?? 'Something went wrong';

    clearTimeout(timeoutID);
    timeoutID = setTimeout(() => {
      close();
    }, 3 * 1000);
  }

  function close() {
    clearTimeout(timeoutID);
    isShow.value = false;
  }

  return {
    isShow,
    title,
    body,
    show,
    close,
  };
});
