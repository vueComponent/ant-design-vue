import classNames from 'classnames';
import TextArea from './TextArea';
import omit from 'omit.js';
import inputProps from './inputProps';
import { hasProp, getComponentFromProp } from '../_util/props-util';
import { isIE, isIE9 } from '../_util/env';

function noop() {}

function fixControlledValue(value) {
  if (typeof value === 'undefined' || value === null) {
    return '';
  }
  return value;
}

export default {
  name: 'AInput',
  inheritAttrs: false,
  model: {
    prop: 'value',
    event: 'change.value',
  },
  props: {
    ...inputProps,
  },
  data() {
    const { value, defaultValue } = this.$props;
    return {
      stateValue: fixControlledValue(!hasProp(this, 'value') ? defaultValue : value),
    };
  },
  watch: {
    value(val) {
      this.stateValue = fixControlledValue(val);
    },
  },
  mounted() {
    this.$nextTick(() => {
      if (this.autoFocus) {
        this.focus();
      }
    });
  },
  methods: {
    handleKeyDown(e) {
      if (e.keyCode === 13) {
        this.$emit('pressEnter', e);
      }
      this.$emit('keydown', e);
    },
    handleChange(e) {
      // https://github.com/vueComponent/ant-design-vue/issues/92
      if (isIE && !isIE9 && this.stateValue === e.target.value) {
        return;
      }
      if (!hasProp(this, 'value')) {
        this.stateValue = e.target.value;
      } else {
        this.$forceUpdate();
      }
      if (!e.target.composing) {
        this.$emit('change.value', e.target.value);
      }
      this.$emit('change', e);
      this.$emit('input', e);
    },

    focus() {
      this.$refs.input.focus();
    },

    blur() {
      this.$refs.input.blur();
    },
    select() {
      this.$refs.input.select();
    },

    getInputClassName() {
      const { prefixCls, size, disabled } = this.$props;
      return {
        [`${prefixCls}`]: true,
        [`${prefixCls}-sm`]: size === 'small',
        [`${prefixCls}-lg`]: size === 'large',
        [`${prefixCls}-disabled`]: disabled,
      };
    },
    renderLabeledInput(children) {
      const props = this.$props;
      let addonAfter = getComponentFromProp(this, 'addonAfter');
      let addonBefore = getComponentFromProp(this, 'addonBefore');
      // Not wrap when there is not addons
      if (!addonBefore && !addonAfter) {
        return children;
      }

      const wrapperClassName = `${props.prefixCls}-group`;
      const addonClassName = `${wrapperClassName}-addon`;
      addonBefore = addonBefore ? <span class={addonClassName}>{addonBefore}</span> : null;

      addonAfter = addonAfter ? <span class={addonClassName}>{addonAfter}</span> : null;

      const className = {
        [`${props.prefixCls}-wrapper`]: true,
        [wrapperClassName]: addonBefore || addonAfter,
      };

      const groupClassName = classNames(`${props.prefixCls}-group-wrapper`, {
        [`${props.prefixCls}-group-wrapper-sm`]: props.size === 'small',
        [`${props.prefixCls}-group-wrapper-lg`]: props.size === 'large',
      });
      return (
        <span class={groupClassName}>
          <span class={className}>
            {addonBefore}
            {children}
            {addonAfter}
          </span>
        </span>
      );
    },
    renderLabeledIcon(children) {
      const { prefixCls, size } = this.$props;
      let prefix = getComponentFromProp(this, 'prefix');
      let suffix = getComponentFromProp(this, 'suffix');

      // if (!prefix && !suffix) {
      //   return children;
      // }

      /**
       * 注释掉上面的代码是因为
       * https://github.com/vueComponent/ant-design-vue/issues/685
       * 当 prevfix 和 suffix 都不存在的时候 最终render出来的 dom 结构发生了变化 （ 少了一个 span 包裹 ）
       * 当 prevfix 或者 suffix 从隐藏到现实 render 出来的 dom 缺少一个span包裹, vue 应该会替换掉整个dom，从而导致第一次变化的时候，input是个全新的并且没有聚焦
       *
       */

      prefix = prefix ? <span class={`${prefixCls}-prefix`}>{prefix}</span> : null;

      suffix = suffix ? <span class={`${prefixCls}-suffix`}>{suffix}</span> : null;
      const affixWrapperCls = classNames(`${prefixCls}-affix-wrapper`, {
        [`${prefixCls}-affix-wrapper-sm`]: size === 'small',
        [`${prefixCls}-affix-wrapper-lg`]: size === 'large',
      });
      return (
        <span class={affixWrapperCls}>
          {prefix}
          {children}
          {suffix}
        </span>
      );
    },

    renderInput() {
      const otherProps = omit(this.$props, [
        'prefixCls',
        'addonBefore',
        'addonAfter',
        'prefix',
        'suffix',
        'value',
        'defaultValue',
      ]);
      const { stateValue, getInputClassName, handleKeyDown, handleChange, $listeners } = this;
      const inputProps = {
        domProps: {
          value: stateValue,
        },
        attrs: { ...otherProps, ...this.$attrs },
        on: {
          ...$listeners,
          keydown: handleKeyDown,
          input: handleChange,
          change: noop,
        },
        class: getInputClassName(),
        ref: 'input',
      };
      if ($listeners['change.value']) {
        inputProps.directives = [{ name: 'ant-input' }];
      }
      return this.renderLabeledIcon(<input {...inputProps} />);
    },
  },
  render() {
    if (this.$props.type === 'textarea') {
      const { $listeners } = this;
      const textareaProps = {
        props: this.$props,
        attrs: this.$attrs,
        on: {
          ...$listeners,
          change: this.handleChange,
          keydown: this.handleKeyDown,
        },
        directives: [
          {
            name: 'ant-input',
          },
        ],
      };
      return <TextArea {...textareaProps} ref="input" />;
    }
    return this.renderLabeledInput(this.renderInput());
  },
};
