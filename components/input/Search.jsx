import classNames from 'classnames';
import Input from './Input';
import Icon from '../icon';
import inputProps from './inputProps';
import Button from '../button';
import { cloneElement } from '../_util/vnode';
import { getOptionProps, getComponentFromProp, isValidElement } from '../_util/props-util';
import PropTypes from '../_util/vue-types';
import { ConfigConsumerProps } from '../config-provider';

export default {
  name: 'AInputSearch',
  inheritAttrs: false,
  model: {
    prop: 'value',
    event: 'change.value',
  },
  props: {
    ...inputProps,
    enterButton: PropTypes.oneOfType([PropTypes.bool, PropTypes.string, PropTypes.object]),
  },
  inject: {
    configProvider: { default: () => ConfigConsumerProps },
  },
  methods: {
    onSearch(e) {
      this.$emit('search', this.$refs.input.stateValue, e);
      this.$refs.input.focus();
    },
    focus() {
      this.$refs.input.focus();
    },

    blur() {
      this.$refs.input.blur();
    },
    renderSuffix(prefixCls) {
      const suffix = getComponentFromProp(this, 'suffix');
      const enterButton = getComponentFromProp(this, 'enterButton');
      if (enterButton) return suffix;

      const node = (
        <Icon class={`${prefixCls}-icon`} type="search" key="searchIcon" onClick={this.onSearch} />
      );

      if (suffix) {
        // let cloneSuffix = suffix;
        // if (isValidElement(cloneSuffix) && !cloneSuffix.key) {
        //   cloneSuffix = cloneElement(cloneSuffix, {
        //     key: 'originSuffix',
        //   });
        // }
        return [suffix, node];
      }

      return node;
    },
    renderAddonAfter(prefixCls) {
      const { size, disabled } = this;
      const enterButton = getComponentFromProp(this, 'enterButton');
      const addonAfter = getComponentFromProp(this, 'addonAfter');
      if (!enterButton) return addonAfter;
      const btnClassName = `${prefixCls}-button`;
      const enterButtonAsElement = Array.isArray(enterButton) ? enterButton[0] : enterButton;
      let button;
      if (
        enterButtonAsElement.tag === 'button' ||
        (enterButtonAsElement.componentOptions &&
          enterButtonAsElement.componentOptions.Ctor.extendOptions.__ANT_BUTTON)
      ) {
        button = cloneElement(enterButtonAsElement, {
          class: btnClassName,
          props: { size },
          on: {
            click: this.onSearch,
          },
        });
      } else {
        button = (
          <Button
            class={btnClassName}
            type="primary"
            size={size}
            disabled={disabled}
            key="enterButton"
            onClick={this.onSearch}
          >
            {enterButton === true ? <Icon type="search" /> : enterButton}
          </Button>
        );
      }
      if (addonAfter) {
        return [button, addonAfter];
      }

      return button;
    },
  },
  render() {
    const {
      prefixCls: customizePrefixCls,
      inputPrefixCls: customizeInputPrefixCls,
      size,
      ...others
    } = getOptionProps(this);
    const getPrefixCls = this.configProvider.getPrefixCls;
    const prefixCls = getPrefixCls('input-search', customizePrefixCls);
    const inputPrefixCls = getPrefixCls('input', customizeInputPrefixCls);

    const enterButton = getComponentFromProp(this, 'enterButton');
    const addonBefore = getComponentFromProp(this, 'addonBefore');
    let inputClassName;
    if (enterButton) {
      inputClassName = classNames(prefixCls, {
        [`${prefixCls}-enter-button`]: !!enterButton,
        [`${prefixCls}-${size}`]: !!size,
      });
    } else {
      inputClassName = prefixCls;
    }

    const on = { ...this.$listeners };
    delete on.search;
    const inputProps = {
      props: {
        ...others,
        prefixCls: inputPrefixCls,
        size,
        suffix: this.renderSuffix(prefixCls),
        addonAfter: this.renderAddonAfter(prefixCls),
        addonBefore,
      },
      attrs: this.$attrs,
      class: inputClassName,
      ref: 'input',
      on: {
        pressEnter: this.onSearch,
        ...on,
      },
    };
    return <Input {...inputProps} />;
  },
};
