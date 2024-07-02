import keyCode from '../../_util/KeyCode';

export function isEventFromHandle(e: { target: HTMLElement }, handles) {
  try {
    return Object.keys(handles).some(key => e.target === handles[key].ref);
  } catch (error) {
    return false;
  }
}

export function isValueOutOfRange(value: number, { min, max }: { min?: number; max?: number }) {
  return value < min || value > max;
}

export function isNotTouchEvent(e: TouchEvent) {
  return e.touches.length > 1 || (e.type.toLowerCase() === 'touchend' && e.touches.length > 0);
}

export function getClosestPoint(val: number, { marks, step, min, max }) {
  const points = Object.keys(marks).map(parseFloat);
  if (step !== null) {
    const baseNum = 10 ** getPrecision(step);
    const maxSteps = Math.floor((max * baseNum - min * baseNum) / (step * baseNum));
    const steps = Math.min((val - min) / step, maxSteps);
    const closestStep = Math.round(steps) * step + min;
    points.push(closestStep);
  }
  const diffs = points.map(point => Math.abs(val - point));
  return points[diffs.indexOf(Math.min(...diffs))];
}

export function getPrecision(step: number) {
  const stepString = step.toString();
  let precision = 0;
  if (stepString.indexOf('.') >= 0) {
    precision = stepString.length - stepString.indexOf('.') - 1;
  }
  return precision;
}

export function getMousePosition(vertical: boolean, e: MouseEvent) {
  let zoom = 1;
  if (window.visualViewport) {
    zoom = +(window.visualViewport.width / document.body.getBoundingClientRect().width).toFixed(2);
  }
  return (vertical ? e.clientY : e.pageX) / zoom;
}

export function getTouchPosition(vertical: boolean, e: TouchEvent) {
  let zoom = 1;
  if (window.visualViewport) {
    zoom = +(window.visualViewport.width / document.body.getBoundingClientRect().width).toFixed(2);
  }
  return (vertical ? e.touches[0].clientY : e.touches[0].pageX) / zoom;
}

export function getHandleCenterPosition(vertical: boolean, handle: HTMLElement) {
  const coords = handle.getBoundingClientRect();
  return vertical
    ? coords.top + coords.height * 0.5
    : window.scrollX + coords.left + coords.width * 0.5;
}

export function ensureValueInRange(val: number, { max, min }: { max?: number; min?: number }) {
  if (val <= min) {
    return min;
  }
  if (val >= max) {
    return max;
  }
  return val;
}

export function ensureValuePrecision(val: number, props: any) {
  const { step } = props;
  const closestPoint = isFinite(getClosestPoint(val, props)) ? getClosestPoint(val, props) : 0; // eslint-disable-line
  return step === null ? closestPoint : parseFloat(closestPoint.toFixed(getPrecision(step)));
}

export function pauseEvent(e: Event) {
  e.stopPropagation();
  e.preventDefault();
}

export function calculateNextValue(func, value, props) {
  const operations = {
    increase: (a, b) => a + b,
    decrease: (a, b) => a - b,
  };

  const indexToGet = operations[func](Object.keys(props.marks).indexOf(JSON.stringify(value)), 1);
  const keyToGet = Object.keys(props.marks)[indexToGet];

  if (props.step) {
    return operations[func](value, props.step);
  }
  if (!!Object.keys(props.marks).length && !!props.marks[keyToGet]) {
    return props.marks[keyToGet];
  }
  return value;
}

export function getKeyboardValueMutator(e: KeyboardEvent, vertical: boolean, reverse: boolean) {
  const increase = 'increase';
  const decrease = 'decrease';
  let method = increase;
  switch (e.keyCode) {
    case keyCode.UP:
      method = vertical && reverse ? decrease : increase;
      break;
    case keyCode.RIGHT:
      method = !vertical && reverse ? decrease : increase;
      break;
    case keyCode.DOWN:
      method = vertical && reverse ? increase : decrease;
      break;
    case keyCode.LEFT:
      method = !vertical && reverse ? increase : decrease;
      break;

    case keyCode.END:
      return (_value, props) => props.max;
    case keyCode.HOME:
      return (_value, props) => props.min;
    case keyCode.PAGE_UP:
      return (value, props) => value + props.step * 2;
    case keyCode.PAGE_DOWN:
      return (value, props) => value - props.step * 2;

    default:
      return undefined;
  }
  return (value, props) => calculateNextValue(method, value, props);
}
