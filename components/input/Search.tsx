import { defineComponent, inject } from 'vue';
import classNames from '../_util/classNames';
import isMobile from '../_util/isMobile';
import Input from './Input';
import LoadingOutlined from '@ant-design/icons-vue/LoadingOutlined';
import SearchOutlined from '@ant-design/icons-vue/SearchOutlined';
import inputProps from './inputProps';
import Button from '../button';
import { cloneElement } from '../_util/vnode';
import PropTypes from '../_util/vue-types';
import { getOptionProps, getComponent } from '../_util/props-util';
import { defaultConfigProvider } from '../config-provider';
import isPlainObject from 'lodash-es/isPlainObject';

export default defineComponent({
  name: 'AInputSearch',
  inheritAttrs: false,
  props: {
    ...inputProps,
    // 不能设置默认值 https://github.com/vueComponent/ant-design-vue/issues/1916
    enterButton: PropTypes.VNodeChild,
    onSearch: PropTypes.func,
  },
  setup() {
    return {
      configProvider: inject('configProvider', defaultConfigProvider),
      input: null,
    };
  },
  methods: {
    saveInput(node: HTMLInputElement) {
      this.input = node;
    },
    handleChange(e: Event) {
      this.$emit('update:value', (e.target as HTMLInputElement).value);
      if (e && e.target && e.type === 'click') {
        this.$emit('search', (e.target as HTMLInputElement).value, e);
      }
      this.$emit('change', e);
    },
    handleSearch(e: Event) {
      if (this.loading || this.disabled) {
        return;
      }
      this.$emit('search', this.input.stateValue, e);
      if (!isMobile.tablet) {
        this.input.focus();
      }
    },
    focus() {
      this.input.focus();
    },

    blur() {
      this.input.blur();
    },
    renderLoading(prefixCls: string) {
      const { size } = this.$props;
      let enterButton = getComponent(this, 'enterButton');
      // 兼容 <a-input-search enterButton />， 因enterButton类型为 any，此类写法 enterButton 为空字符串
      enterButton = enterButton || enterButton === '';
      if (enterButton) {
        return (
          <Button class={`${prefixCls}-button`} type="primary" size={size} key="enterButton">
            <LoadingOutlined />
          </Button>
        );
      }
      return <LoadingOutlined class={`${prefixCls}-icon`} key="loadingIcon" />;
    },
    renderSuffix(prefixCls: string) {
      const { loading } = this;
      const suffix = getComponent(this, 'suffix');
      let enterButton = getComponent(this, 'enterButton');
      // 兼容 <a-input-search enterButton />， 因enterButton类型为 any，此类写法 enterButton 为空字符串
      enterButton = enterButton || enterButton === '';
      if (loading && !enterButton) {
        return [suffix, this.renderLoading(prefixCls)];
      }

      if (enterButton) return suffix;

      const icon = (
        <SearchOutlined class={`${prefixCls}-icon`} key="searchIcon" onClick={this.handleSearch} />
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
    renderAddonAfter(prefixCls: string) {
      const { size, disabled, loading } = this;
      const btnClassName = `${prefixCls}-button`;
      let enterButton = getComponent(this, 'enterButton');
      enterButton = enterButton || enterButton === '';
      const addonAfter = getComponent(this, 'addonAfter');
      if (loading && enterButton) {
        return [this.renderLoading(prefixCls), addonAfter];
      }
      if (!enterButton) return addonAfter;
      const enterButtonAsElement = Array.isArray(enterButton) ? enterButton[0] : enterButton;
      let button: any;
      const isAntdButton =
        enterButtonAsElement.type &&
        isPlainObject(enterButtonAsElement.type) &&
        enterButtonAsElement.type.__ANT_BUTTON;
      if (enterButtonAsElement.tagName === 'button' || isAntdButton) {
        button = cloneElement(enterButtonAsElement, {
          key: 'enterButton',
          class: isAntdButton ? btnClassName : '',
          ...(isAntdButton ? { size } : {}),
          onClick: this.handleSearch,
        });
      } else {
        button = (
          <Button
            class={btnClassName}
            type="primary"
            size={size}
            disabled={disabled}
            key="enterButton"
            onClick={this.handleSearch}
          >
            {enterButton === true || enterButton === '' ? <SearchOutlined /> : enterButton}
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
      class: className,
      ...restProps
    } = { ...getOptionProps(this), ...this.$attrs } as any;
    delete restProps.onSearch;
    delete restProps.loading;
    delete restProps.enterButton;
    delete restProps.addonBefore;
    delete restProps['onUpdate:value'];
    const getPrefixCls = this.configProvider.getPrefixCls;
    const prefixCls = getPrefixCls('input-search', customizePrefixCls);
    const inputPrefixCls = getPrefixCls('input', customizeInputPrefixCls);

    let enterButton = getComponent(this, 'enterButton');
    const addonBefore = getComponent(this, 'addonBefore');
    enterButton = enterButton || enterButton === '';
    let inputClassName: string;
    if (enterButton) {
      inputClassName = classNames(prefixCls, className, {
        [`${prefixCls}-enter-button`]: !!enterButton,
        [`${prefixCls}-${size}`]: !!size,
      });
    } else {
      inputClassName = classNames(prefixCls, className);
    }

    const inputProps = {
      ...restProps,
      prefixCls: inputPrefixCls,
      size,
      suffix: this.renderSuffix(prefixCls),
      prefix: getComponent(this, 'prefix'),
      addonAfter: this.renderAddonAfter(prefixCls),
      addonBefore,
      class: inputClassName,
      onPressEnter: this.handleSearch,
      onChange: this.handleChange,
    };
    return <Input {...inputProps} ref={this.saveInput} />;
  },
});
