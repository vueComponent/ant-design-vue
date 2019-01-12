import PropTypes from '../_util/vue-types';
export const Store = PropTypes.shape({
  setState: PropTypes.func,
  getState: PropTypes.func,
  subscribe: PropTypes.func,
}).loose;

import create from '../_util/store/create';
const createStore = create;

export default createStore;
