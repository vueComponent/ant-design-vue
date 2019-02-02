import warning from 'warning';

const warned = {};
export default (valid, message) => {
  if (!valid && !warned[message]) {
    warning(false, message);
    warned[message] = true;
  }
};
