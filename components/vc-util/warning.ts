/* eslint-disable no-console */
let warned: Record<string, boolean> = {};

export function warning(valid: boolean, message: string) {
  // Support uglify
  if (process.env.NODE_ENV !== 'production' && !valid && console !== undefined) {
    console.error(`Warning: ${message}`);
  }
}

export function note(valid: boolean, message: string) {
  // Support uglify
  if (process.env.NODE_ENV !== 'production' && !valid && console !== undefined) {
    console.warn(`Note: ${message}`);
  }
}

export function resetWarned() {
  warned = {};
}

export function call(
  method: (valid: boolean, message: string) => void,
  valid: boolean,
  message: string,
) {
  if (!valid && !warned[message]) {
    method(false, message);
    warned[message] = true;
  }
}

export function warningOnce(valid: boolean, message: string) {
  call(warning, valid, message);
}

export function noteOnce(valid: boolean, message: string) {
  call(note, valid, message);
}

export default warningOnce;
/* eslint-enable */
