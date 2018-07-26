import _extends from 'babel-runtime/helpers/extends';
import defaultLocale from '../locale-provider/default';

// export interface ModalLocale {
//   okText: string;
//   cancelText: string;
//   justOkText: string;
// }

var runtimeLocale = _extends({}, defaultLocale.Modal);

export function changeConfirmLocale(newLocale) {
  if (newLocale) {
    runtimeLocale = _extends({}, runtimeLocale, newLocale);
  } else {
    runtimeLocale = _extends({}, defaultLocale.Modal);
  }
}

export function getConfirmLocale() {
  return runtimeLocale;
}