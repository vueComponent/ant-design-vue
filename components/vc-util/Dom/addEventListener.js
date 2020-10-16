export default function addEventListenerWrap(target, eventType, cb, option) {
  if (target.addEventListener) {
    target.addEventListener(eventType, cb, option);
  }
  return {
    remove: () => {
      if (target.removeEventListener) {
        target.removeEventListener(eventType, cb);
      }
    },
  };
}
