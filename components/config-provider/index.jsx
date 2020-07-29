import { reactive, provide } from 'vue';
import PropTypes from '../_util/vue-types';
import { getComponent, getSlot } from '../_util/props-util';
import defaultRenderEmpty from './renderEmpty';
import LocaleProvider, { ANT_MARK } from '../locale-provider';
import LocaleReceiver from '../locale-provider/LocaleReceiver';

function getWatch(keys = []) {
  const watch = {};
  keys.forEach(k => {
    watch[k] = function(value) {
      this.configProvider[k] = value;
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
  created() {
    this.configProvider = reactive({
      ...this.$props,
      getPrefixCls: this.getPrefixCls,
      renderEmpty: this.renderEmptyComponent,
    });
    provide('configProvider', this.configProvider);
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
    renderEmptyComponent(name) {
      const renderEmpty = getComponent(this, 'renderEmpty', {}, false) || defaultRenderEmpty;
      return renderEmpty(name);
    },
    getPrefixCls(suffixCls, customizePrefixCls) {
      const { prefixCls = 'ant' } = this.$props;
      if (customizePrefixCls) return customizePrefixCls;
      return suffixCls ? `${prefixCls}-${suffixCls}` : prefixCls;
    },
    renderProvider(legacyLocale) {
      return (
        <LocaleProvider locale={this.locale || legacyLocale} _ANT_MARK__={ANT_MARK}>
          {getSlot(this)}
        </LocaleProvider>
      );
    },
  },

  render() {
    return <LocaleReceiver children={(_, __, legacyLocale) => this.renderProvider(legacyLocale)} />;
  },
};

export const ConfigConsumerProps = {
  getPrefixCls: (suffixCls, customizePrefixCls) => {
    if (customizePrefixCls) return customizePrefixCls;
    return `ant-${suffixCls}`;
  },
  renderEmpty: defaultRenderEmpty,
};

/* istanbul ignore next */
ConfigProvider.install = function(app) {
  app.component(ConfigProvider.name, ConfigProvider);
};

export default ConfigProvider;
