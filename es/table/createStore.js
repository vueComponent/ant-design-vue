import PropTypes from '../_util/vue-types';
export var Store = PropTypes.shape({
  setState: PropTypes.func,
  getState: PropTypes.func,
  subscribe: PropTypes.func
}).loose;

import create from '../_util/store/create';
var createStore = create;

export default createStore;