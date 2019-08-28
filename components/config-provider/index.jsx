import PropTypes from '../_util/vue-types';
import Base from '../base';

const ConfigProvider = {
  name: 'AConfigProvider',
  props: {
    getPopupContainer: PropTypes.func,
  },
  provide() {
    return {
      configProvider: this.$props,
    };
  },
  render() {
    return this.$slots.default ? this.$slots.default[0] : null;
  },
};

/* istanbul ignore next */
ConfigProvider.install = function(Vue) {
  Vue.use(Base);
  Vue.component(ConfigProvider.name, ConfigProvider);
};

export default ConfigProvider;
