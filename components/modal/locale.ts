import { ref } from 'vue';
import defaultLocale from '../locale/default';

export interface ModalLocale {
  okText: string;
  cancelText: string;
  justOkText: string;
}

const runtimeLocale = ref({
  ...defaultLocale.Modal,
});

export function changeConfirmLocale(newLocale?: ModalLocale) {
  if (newLocale) {
    runtimeLocale.value = {
      ...runtimeLocale,
      ...newLocale,
    };
  } else {
    runtimeLocale.value = {
      ...defaultLocale.Modal,
    };
  }
}

export function getConfirmLocale() {
  return runtimeLocale.value;
}
