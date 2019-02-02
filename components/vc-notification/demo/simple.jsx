/* eslint-disable no-console, no-unused-vars */
import '../assets/index.less';
import Notification from '../index';
let notification = null;
Notification.newInstance(
  {
    maxCount: 10,
  },
  n => {
    notification = n;
  },
);

function simpleFn() {
  notification.notice({
    content: () => {
      return <span>simple show</span>;
    },
    onClose() {
      console.log('simple close');
    },
  });
}

function durationFn() {
  notification.notice({
    content: h => {
      return <span>can not close...</span>;
    },
    duration: null,
  });
}

function closableFn() {
  notification.notice({
    content: h => {
      return <span>closable</span>;
    },
    duration: null,
    onClose() {
      console.log('closable close');
    },
    onClick() {
      console.log('clicked!!!');
    },
    closable: true,
  });
}

function close(key) {
  notification.removeNotice(key);
}

function manualClose() {
  const key = Date.now();
  notification.notice({
    content: h => {
      return (
        <div>
          <p>click below button to close</p>
          <button onClick={close.bind(null, key)}>close</button>
        </div>
      );
    },
    key,
    duration: null,
  });
}

let counter = 0;
let intervalKey;
function updatableFn() {
  if (counter !== 0) {
    return;
  }

  const key = 'updatable-notification';
  const initialProps = {
    content: `Timer: ${counter}s`,
    key,
    duration: null,
    closable: true,
    onClose() {
      clearInterval(intervalKey);
      counter = 0;
    },
  };

  notification.notice(initialProps);
  intervalKey = setInterval(() => {
    notification.notice({ ...initialProps, content: `Timer: ${++counter}s` });
  }, 1000);
}

export default {
  render() {
    return (
      <div>
        <button onClick={simpleFn}>simple show</button>
        <button onClick={durationFn}>duration=0</button>
        <button onClick={closableFn}>closable</button>
        <button onClick={manualClose}>controlled close</button>
        <button onClick={updatableFn}>updatable</button>
      </div>
    );
  },
};
