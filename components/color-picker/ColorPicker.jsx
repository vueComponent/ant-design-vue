/* eslint-disable */
import PropTypes from '../_util/vue-types';
import { defaultConfigProvider } from '../config-provider';
import BaseMixin from '../_util/BaseMixin';
import Pickr from '@simonwep/pickr/dist/pickr.es5.min';
import Icon from '../icon';
import LocaleReceiver from '../locale-provider/LocaleReceiver';
import enUS from './locale/en_US';
import debounce from 'lodash-es/debounce';

import { getOptionProps, findDOMNode } from '../_util/props-util';
let colors = '#194d33';
export default {
  name: 'AColorPicker',
  mixins: [BaseMixin],
  inject: {
    configProvider: { default: () => defaultConfigProvider },
  },
  model: {
    prop: 'value',
    event: 'change.value', //为了支持v-model直接返回颜色字符串 所以用了自定义的事件,与pickr自带change事件进行区分
  },
  props: {
    prefixCls: PropTypes.string,
    defaultValue: PropTypes.string, //默认值
    config: PropTypes.object, //pickr配置
    value: PropTypes.string, //颜色值
    locale: PropTypes.object, //双语包
    colorRounded: PropTypes.number, //颜色数值保留几位小数
    size: PropTypes.oneOf(['default', 'small', 'large']).def('default'), //尺寸
    getPopupContainer: PropTypes.func, //指定渲染容器
    disabled: PropTypes.looseBool.def(false), //是否禁用
    format: PropTypes.string, //颜色格式设置
    alpha: PropTypes.looseBool.def(false), //是否开启透明通道
    hue: PropTypes.looseBool.def(true), //是否开启色彩预选
  },

  data() {
    return {
      colors,
      myOpen: false,
      pickr: null,
      i18n: enUS,
    };
  },
  watch: {
    'configProvider.locale.ColorPicker': {
      handler(val) {
        if (this.locale) return;
        this.i18n = val;
        this.reInitialize();
      },
    },
    locale(val) {
      this.i18n = val.ColorPicker || val.lang;
      this.reInitialize();
    },
    value(val) {
      this.setColor(val);
    },
    disabled(val) {
      this.pickr[val ? 'disable' : 'enable']();
    },
    config: {
      handler() {
        this.reInitialize();
      },
      deep: true,
    },
    format(val) {
      const type = val.toLocaleUpperCase();
      let res = this.pickr.setColorRepresentation(type);
      if (res) {
        this.pickr.applyColor();
      } else {
        throw new TypeError('format was invalid');
      }
    },
  },
  mounted() {
    if (this.locale) {
      this.i18n = this.locale.ColorPicker || this.locale.lang;
    }
    this.createPickr();
    this.eventsBinding();
  },
  unmounted() {
    this.pickr.destroyAndRemove();
  },
  methods: {
    reInitialize() {
      this.pickr.destroyAndRemove();
      const dom = document.createElement('div');
      dom.id = 'color-picker' + this._uid;
      const box = findDOMNode(this).querySelector('#color-picker-box' + this._uid);
      box.appendChild(dom);
      this.createPickr();
      this.eventsBinding();
    },
    setColor: debounce(function (val) {
      this.pickr.setColor(val);
    }, 1000),
    eventsBinding() {
      const pickrEvents = [
        'init',
        'hide',
        'show',
        'save',
        'clear',
        'change',
        'changestop',
        'cancel',
        'swatchselect',
      ];
      Object.keys(this.$listeners).forEach(event => {
        pickrEvents.includes(event) && this.pickr.on(event, this.$listeners[event]);
      });
    },
    createPickr() {
      const { getPopupContainer } = getOptionProps(this);
      const { getPopupContainer: getContextPopupContainer } = this.configProvider;
      const container = getPopupContainer || getContextPopupContainer;
      this.pickr = Pickr.create(
        Object.assign(
          {
            el: '#color-picker' + this._uid,
            container: (container && container(findDOMNode(this))) || document.body,
            theme: 'monolith', // or 'monolith', or 'nano'
            default: this.value || this.defaultValue || null, // 有默认颜色pickr才可以获取到_representation
            components: {
              // Main components
              preview: true,
              opacity: this.alpha,
              hue: this.hue,
              // Input / output Options
              interaction: {
                hex: true,
                rgba: true,
                input: true,
                clear: true,
                save: true,
              },
            },
          },
          this.config,
          { i18n: this.i18n },
        ),
      )
        .on('save', (color, instance) => {
          if (color) {
            let _representation = instance._representation || 'HEXA';
            color = color['to' + _representation]().toString(this.colorRounded || 0);
          }
          this.$emit('change.value', color || '');
        })
        .on('hide', () => {
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
      const { disabled } = getOptionProps(this);
      const classString = {
        [prefixCls]: true,
        [`${prefixCls}-open`]: this.myOpen,
        [`${prefixCls}-lg`]: this.size === 'large',
        [`${prefixCls}-sm`]: this.size === 'small',
        [`${prefixCls}-disabled`]: this.disabled,
      };
      return (
        <div class={classString} tabindex={disabled ? -1 : 0} onClick={this.handleOpenChange}>
          <div class={`${prefixCls}-selection`}>
            <div id={'color-picker-box' + this._uid}>
              <div id={'color-picker' + this._uid}></div>
            </div>
            <Icon type="down" class={`${prefixCls}-icon`} />
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
