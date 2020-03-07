import addDOMEventListener from 'add-dom-event-listener';

export default function addEventListenerWrap(target, eventType, cb, option) {
  return addDOMEventListener(target, eventType, cb, option);
}
