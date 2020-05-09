import PropTypes from '../_util/vue-types';
import { ConfigConsumerProps } from '../config-provider';
import BaseMixin from '../_util/BaseMixin';
import Pickr from '@simonwep/pickr/dist/pickr.es5.min';
import IconDownOutlined from '@ant-design/icons-vue/DownOutlined';
import LocaleReceiver from '../locale-provider/LocaleReceiver';
import enUS from './locale/en_US';

import {
  getOptionProps,
} from '../_util/props-util';
let colors = '#194d33';
export default {
  name: 'AColorPicker',
  mixins: [BaseMixin],
  model: {
    prop: 'value',
    event: 'myChange',//为了支持v-model直接返回颜色字符串 所以用了自定义的事件,与pickr自带change事件进行区分
  },
  props: {
    prefixCls: PropTypes.string,
    defaultValue:PropTypes.string,//默认值
    config: PropTypes.object,//pickr配置
    value: PropTypes.string,//颜色值
    locale: PropTypes.object,//双语包
    colorRounded: PropTypes.number,//颜色数值保留几位小数
    size: PropTypes.string,//尺寸
    getPopupContainer: PropTypes.func,//指定渲染容器
  },
  inject: {
    configProvider: { default: () => ConfigConsumerProps },
  },
  data() {
    return {
      colors,
      myOpen: false,
      pickr: null,
    };
  },
  mounted() {
    this.createPickr();
    this.eventsBinding();
  },
  methods: {
    eventsBinding() {
      Object.keys(this.$listeners).forEach(event => {
        this.pickr.on(event, this.$listeners[event]);
      });
    },
    createPickr() {
      const { getPopupContainer } = getOptionProps(this);
      const { getPopupContainer: getContextPopupContainer } = this.configProvider;
      const container = getPopupContainer || getContextPopupContainer;
      this.pickr = Pickr.create(Object.assign({
        el: '#color-picker' + this._uid,
        container: (container && container(this.$el)) || document.body,
        theme: 'monolith', // or 'monolith', or 'nano'
        default: this.value || this.defaultValue || '#1890ff', // 有默认颜色pickr才可以获取到_representation
        components: {
          // Main components
          preview: true,
          opacity: true,
          hue: true,
          // Input / output Options
          interaction: {
            hex: true,
            rgba: true,
            input: true,
            clear: true,
            save: true,
          },
        },
      }, this.config)).on('save', (color, instance) => {
        if (color) {
          color = color['to' + instance._representation]().toString(this.colorRounded || 0);
        }
        this.$emit('myChange', color || '');
      }).on('hide', () => {
        this.setState({ myOpen: false });
      });
    },
    handleOpenChange() {
      const open = !this.myOpen;
      this.setState({ myOpen: open });
      this.pickr[open ? 'show' : 'hide']();
      this.$emit('openChange', open);
    },
    getDefaultLocale() {
      const result = {
        ...enUS,
        ...this.$props.locale,
      };
      result.lang = {
        ...result.lang,
        ...(this.$props.locale || {}).lang,
      };
      return result;
    },
    renderColorPicker() {
      const { prefixCls: customizePrefixCls } = this.$props;
      const { getPrefixCls } = this.configProvider;
      const prefixCls = getPrefixCls('color-picker', customizePrefixCls);
      const props = getOptionProps(this);
      const classString = {
        [`${prefixCls}-box`]: true,
        [`${prefixCls}-open`]: this.myOpen,
      };
      const sizeOpt = {
        'large': `${prefixCls}-lg`,
        'small': `${prefixCls}-sm`,
      };
      if (sizeOpt[this.size]) {
        classString[sizeOpt[this.size]] = true;
      }
      return (
        <div
          class={classString}
          tabIndex={props.disabled ? -1 : 0}
          onClick={this.handleOpenChange}
          {...this.$attrs}
        >
          <div class={`${prefixCls}-selection`}>
            <div id={"color-picker" + this._uid}></div>
            <IconDownOutlined class={`${prefixCls}-icon`} />
          </div>
        </div>
      );
    },
  },
  render() {
    return (
      <LocaleReceiver
        componentName="ColorPicker"
        defaultLocale={this.getDefaultLocale}
        scopedSlots={{ default: this.renderColorPicker }}
      />
    );
  },
};
