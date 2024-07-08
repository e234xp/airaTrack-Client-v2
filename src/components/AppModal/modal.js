import { reactive } from 'vue';
import i18n from '../../plugins/i18n'
import useUserStore from '@/stores/user';

const modalObject = reactive({
  isOpen: false,
  header: '',
  body: '',
  buttons: [],
  cancel: () => {},
  confirm: () => {},

  show,
  close,
  relogin,
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

function relogin() {
  const { reloginUser } = useUserStore();
  const { t } = i18n.global;

  modalObject.isOpen = true;
  modalObject.body = t('ReloginHint');
  modalObject.buttons = [
    {
      type: 'secondary',
      text: t('No'),
      action: () => {
        modalObject.isOpen = false;
      }
    },
    {
      type: 'primary',
      text: t('Yes'),
      action: () => {
        modalObject.isOpen = false;
        reloginUser();
      },
    },
  ];
}

export default modalObject;
