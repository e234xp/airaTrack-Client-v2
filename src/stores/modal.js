import { reactive } from 'vue';

const modalObject = reactive({
  isOpen: false,
  header: '',
  body: '',
  buttons: [],

  show,
  close,
});

function show({ header: theHeader = '', body, buttons = [] }) {
  modalObject.isOpen = true;
  modalObject.header = theHeader;
  modalObject.body = body;
  modalObject.buttons = buttons;
}

function close() {
  modalObject.isOpen = false;
}

export default modalObject;
