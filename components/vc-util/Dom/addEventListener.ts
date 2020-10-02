// @ts-ignore
import addDOMEventListener from 'add-dom-event-listener';

export default function addEventListenerWrap(
  target: HTMLElement | Window | Document | null,
  eventType: string,
  cb: (...arg: any[]) => any,
  option?: any,
): {
  remove: () => void;
} {
  return addDOMEventListener(target, eventType, cb, option);
}
