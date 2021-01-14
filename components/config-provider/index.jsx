import Vue from 'vue';
import PropTypes from '../_util/vue-types';
import { filterEmpty, getComponentFromProp } from '../_util/props-util';
import defaultRenderEmpty from './renderEmpty';
import Base from '../base';
import LocaleProvider, { ANT_MARK } from '../locale-provider';
import LocaleReceiver from '../locale-provider/LocaleReceiver';

function getWatch(keys = []) {
  const watch = {};
  keys.forEach(k => {
    watch[k] = function(value) {
      this._proxyVm._data[k] = value;
    };
  });
  return watch;
}

const ConfigProvider = {
  name: 'AConfigProvider',
  props: {
    getPopupContainer: PropTypes.func,
    prefixCls: PropTypes.string,
    renderEmpty: PropTypes.func,
    csp: PropTypes.object,
    autoInsertSpaceInButton: PropTypes.bool,
    locale: PropTypes.object,
    pageHeader: PropTypes.object,
    transformCellText: PropTypes.func,
  },
  provide() {
    const _self = this;
    this._proxyVm = new Vue({
      data() {
        return {
          ..._self.$props,
          getPrefixCls: _self.getPrefixCls,
          renderEmpty: _self.renderEmptyComponent,
        };
      },
    });
    return {
      configProvider: this._proxyVm._data,
    };
  },
  watch: {
    ...getWatch([
      'prefixCls',
      'csp',
      'autoInsertSpaceInButton',
      'locale',
      'pageHeader',
      'transformCellText',
    ]),
  },
  methods: {
    renderEmptyComponent(h, name) {
      const renderEmpty =
        getComponentFromProp(this, 'renderEmpty', {}, false) || defaultRenderEmpty;
      return renderEmpty(h, name);
    },
    getPrefixCls(suffixCls, customizePrefixCls) {
      const { prefixCls = 'ant' } = this.$props;
      if (customizePrefixCls) return customizePrefixCls;
      return suffixCls ? `${prefixCls}-${suffixCls}` : prefixCls;
    },
    renderProvider(legacyLocale) {
      return (
        <LocaleProvider locale={this.locale || legacyLocale} _ANT_MARK__={ANT_MARK}>
          {this.$slots.default ? filterEmpty(this.$slots.default)[0] : null}
        </LocaleProvider>
      );
    },
  },

  render() {
    return (
      <LocaleReceiver
        scopedSlots={{ default: (_, __, legacyLocale) => this.renderProvider(legacyLocale) }}
      />
    );
  },
};

/* istanbul ignore next */
ConfigProvider.install = function(Vue) {
  Vue.use(Base);
  Vue.component(ConfigProvider.name, ConfigProvider);
};

export default ConfigProvider;
