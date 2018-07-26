import warning from 'warning';

var warned = {};
export default (function (valid, message, throwError) {
  if (!valid && !warned[message]) {
    warning(false, message);
    warned[message] = true;
  }
});