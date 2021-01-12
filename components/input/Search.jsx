import classNames from 'classnames';
import { isMobile } from 'is-mobile';
import Input from './Input';
import Icon from '../icon';
import inputProps from './inputProps';
import Button from '../button';
import { cloneElement } from '../_util/vnode';
import PropTypes from '../_util/vue-types';
import { getOptionProps, getComponentFromProp, getListeners } from '../_util/props-util';
import { ConfigConsumerProps } from '../config-provider/configConsumerProps';

export default {
  name: 'AInputSearch',
  inheritAttrs: false,
  model: {
    prop: 'value',
    event: 'change.value',
  },
  props: {
    ...inputProps,
    // 不能设置默认值 https://github.com/vueComponent/ant-design-vue/issues/1916
    enterButton: PropTypes.any,
  },
  inject: {
    configProvider: { default: () => ConfigConsumerProps },
  },
  methods: {
    onChange(e) {
      if (e && e.target && e.type === 'click') {
        this.$emit('search', e.target.value, e);
      }
      this.$emit('change', e);
    },
    onSearch(e) {
      if (this.loading || this.disabled) {
        return;
      }
      this.$emit('search', this.$refs.input.stateValue, e);
      if (!isMobile({ tablet: true })) {
        this.$refs.input.focus();
      }
    },
    focus() {
      this.$refs.input.focus();
    },

    blur() {
      this.$refs.input.blur();
    },
    renderLoading(prefixCls) {
      const { size } = this.$props;
      let enterButton = getComponentFromProp(this, 'enterButton');
      // 兼容 <a-input-search enterButton />， 因enterButton类型为 any，此类写法 enterButton 为空字符串
      enterButton = enterButton || enterButton === '';
      if (enterButton) {
        return (
          <Button class={`${prefixCls}-button`} type="primary" size={size} key="enterButton">
            <Icon type="loading" />
          </Button>
        );
      }
      return <Icon class={`${prefixCls}-icon`} type="loading" key="loadingIcon" />;
    },
    renderSuffix(prefixCls) {
      const { loading } = this;
      const suffix = getComponentFromProp(this, 'suffix');
      let enterButton = getComponentFromProp(this, 'enterButton');
      // 兼容 <a-input-search enterButton />， 因enterButton类型为 any，此类写法 enterButton 为空字符串
      enterButton = enterButton || enterButton === '';
      if (loading && !enterButton) {
        return [suffix, this.renderLoading(prefixCls)];
      }

      if (enterButton) return suffix;

      const icon = (
        <Icon class={`${prefixCls}-icon`} type="search" key="searchIcon" onClick={this.onSearch} />
      );

      if (suffix) {
        // let cloneSuffix = suffix;
        // if (isValidElement(cloneSuffix) && !cloneSuffix.key) {
        //   cloneSuffix = cloneElement(cloneSuffix, {
        //     key: 'originSuffix',
        //   });
        // }
        return [suffix, icon];
      }

      return icon;
    },
    renderAddonAfter(prefixCls) {
      const { size, disabled, loading } = this;
      const btnClassName = `${prefixCls}-button`;
      let enterButton = getComponentFromProp(this, 'enterButton');
      enterButton = enterButton || enterButton === '';
      const addonAfter = getComponentFromProp(this, 'addonAfter');
      if (loading && enterButton) {
        return [this.renderLoading(prefixCls), addonAfter];
      }
      if (!enterButton) return addonAfter;
      const enterButtonAsElement = Array.isArray(enterButton) ? enterButton[0] : enterButton;
      let button;
      const isAntdButton =
        enterButtonAsElement.componentOptions &&
        enterButtonAsElement.componentOptions.Ctor.extendOptions.__ANT_BUTTON;
      if (enterButtonAsElement.tag === 'button' || isAntdButton) {
        button = cloneElement(enterButtonAsElement, {
          key: 'enterButton',
          class: isAntdButton ? btnClassName : '',
          props: isAntdButton ? { size } : {},
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
            {enterButton === true || enterButton === '' ? <Icon type="search" /> : enterButton}
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
      loading,
      ...others
    } = getOptionProps(this);
    const getPrefixCls = this.configProvider.getPrefixCls;
    const prefixCls = getPrefixCls('input-search', customizePrefixCls);
    const inputPrefixCls = getPrefixCls('input', customizeInputPrefixCls);

    let enterButton = getComponentFromProp(this, 'enterButton');
    const addonBefore = getComponentFromProp(this, 'addonBefore');
    enterButton = enterButton || enterButton === '';
    let inputClassName;
    if (enterButton) {
      inputClassName = classNames(prefixCls, {
        [`${prefixCls}-enter-button`]: !!enterButton,
        [`${prefixCls}-${size}`]: !!size,
      });
    } else {
      inputClassName = prefixCls;
    }

    const on = { ...getListeners(this) };
    delete on.search;
    const inputProps = {
      props: {
        ...others,
        prefixCls: inputPrefixCls,
        size,
        suffix: this.renderSuffix(prefixCls),
        prefix: getComponentFromProp(this, 'prefix'),
        addonAfter: this.renderAddonAfter(prefixCls),
        addonBefore,
        className: inputClassName,
      },
      attrs: this.$attrs,
      ref: 'input',
      on: {
        pressEnter: this.onSearch,
        ...on,
        change: this.onChange,
      },
    };
    return <Input {...inputProps} />;
  },
};
