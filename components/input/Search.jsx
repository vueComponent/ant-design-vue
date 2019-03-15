import classNames from 'classnames';
import Input from './Input';
import Icon from '../icon';
import inputProps from './inputProps';
import Button from '../button';
import { cloneElement } from '../_util/vnode';
import { getOptionProps, getComponentFromProp, isValidElement } from '../_util/props-util';
import PropTypes from '../_util/vue-types';

export default {
  name: 'AInputSearch',
  model: {
    prop: 'value',
    event: 'change.value',
  },
  props: {
    ...inputProps,
    prefixCls: {
      default: 'ant-input-search',
      type: String,
    },
    inputPrefixCls: {
      default: 'ant-input',
      type: String,
    },
    enterButton: PropTypes.oneOfType([PropTypes.bool, PropTypes.string, PropTypes.object]),
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
    getButtonOrIcon() {
      const { prefixCls, size, disabled } = this;
      const enterButton = getComponentFromProp(this, 'enterButton');
      const enterButtonAsElement = Array.isArray(enterButton) ? enterButton[0] : enterButton;
      let node;
      if (!enterButton) {
        node = <Icon class={`${prefixCls}-icon`} type="search" key="searchIcon" />;
      } else if (
        enterButtonAsElement.tag === 'button' ||
        (enterButtonAsElement.componentOptions &&
          enterButtonAsElement.componentOptions.Ctor.extendOptions.__ANT_BUTTON)
      ) {
        node = cloneElement(enterButtonAsElement, {
          class: `${prefixCls}-button`,
          props: { size },
        });
      } else {
        node = (
          <Button
            class={`${prefixCls}-button`}
            type="primary"
            size={size}
            disabled={disabled}
            key="enterButton"
          >
            {enterButton === true ? <Icon type="search" /> : enterButton}
          </Button>
        );
      }
      return cloneElement(node, {
        on: {
          click: this.onSearch,
        },
      });
    },
  },
  render() {
    const { prefixCls, inputPrefixCls, size, ...others } = getOptionProps(this);
    const suffix = getComponentFromProp(this, 'suffix');
    const enterButton = getComponentFromProp(this, 'enterButton');
    const addonAfter = getComponentFromProp(this, 'addonAfter');
    const addonBefore = getComponentFromProp(this, 'addonBefore');
    const buttonOrIcon = this.getButtonOrIcon();
    let searchSuffix = suffix ? [suffix, buttonOrIcon] : buttonOrIcon;
    if (Array.isArray(searchSuffix)) {
      searchSuffix = searchSuffix.map((item, index) => {
        if (!isValidElement(item) || item.key) {
          return item;
        }
        return cloneElement(item, { key: index });
      });
    }
    const inputClassName = classNames(prefixCls, {
      [`${prefixCls}-enter-button`]: !!enterButton,
      [`${prefixCls}-${size}`]: !!size,
    });
    const on = { ...this.$listeners };
    delete on.search;
    const inputProps = {
      props: {
        ...others,
        prefixCls: inputPrefixCls,
        size,
        suffix: searchSuffix,
        addonAfter,
        addonBefore,
      },
      attrs: this.$attrs,
      on: {
        pressEnter: this.onSearch,
        ...on,
      },
    };
    return <Input {...inputProps} class={inputClassName} ref="input" />;
  },
};
