import warning, { resetWarned } from '../vc-util/warning';

export { resetWarned };

export default (valid, component, message = '') => {
  warning(valid, `[antdv: ${component}] ${message}`);
};
