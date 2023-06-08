import type { PropType } from 'vue';
import { computed, ref, defineComponent } from 'vue';
import classNames from '../_util/classNames';
import Input from './Input';
import SearchOutlined from '@ant-design/icons-vue/SearchOutlined';
import inputProps from './inputProps';
import Button from '../button';
import { cloneElement } from '../_util/vnode';
import PropTypes from '../_util/vue-types';
import isPlainObject from 'lodash-es/isPlainObject';
import type { ChangeEvent, MouseEventHandler } from '../_util/EventInterface';
import useConfigInject from '../_util/hooks/useConfigInject';
import omit from '../_util/omit';
import isMobile from '../_util/isMobile';

export default defineComponent({
  compatConfig: { MODE: 3 },
  name: 'AInputSearch',
  inheritAttrs: false,
  props: {
    ...inputProps(),
    inputPrefixCls: String,
    // 不能设置默认值 https://github.com/vueComponent/ant-design-vue/issues/1916
    enterButton: PropTypes.any,
    onSearch: {
      type: Function as PropType<
        (value: string, event?: ChangeEvent | MouseEvent | KeyboardEvent) => void
      >,
    },
  },
  setup(props, { slots, attrs, expose, emit }) {
    const inputRef = ref();
    const focus = () => {
      inputRef.value?.focus();
    };
    const blur = () => {
      inputRef.value?.blur();
    };
    expose({
      focus,
      blur,
    });

    const onChange = (e: ChangeEvent) => {
      emit('update:value', (e.target as HTMLInputElement).value);
      if (e && e.target && e.type === 'click') {
        emit('search', e.target.value, e);
      }
      emit('change', e);
    };

    const onMousedown: MouseEventHandler = e => {
      if (document.activeElement === inputRef.value?.input) {
        e.preventDefault();
      }
    };

    const onSearch = (e: MouseEvent | KeyboardEvent) => {
      emit('search', inputRef.value?.stateValue, e);
      if (!isMobile.tablet) {
        inputRef.value.focus();
      }
    };

    const { prefixCls, getPrefixCls, direction, size } = useConfigInject('input-search', props);
    const inputPrefixCls = computed(() => getPrefixCls('input', props.inputPrefixCls));
    return () => {
      const {
        disabled,
        loading,
        addonAfter = slots.addonAfter?.(),
        suffix = slots.suffix?.(),
        ...restProps
      } = props;
      let { enterButton = slots.enterButton?.() ?? false } = props;
      enterButton = enterButton || enterButton === '';
      const searchIcon = typeof enterButton === 'boolean' ? <SearchOutlined /> : null;
      const btnClassName = `${prefixCls.value}-button`;

      const enterButtonAsElement = Array.isArray(enterButton) ? enterButton[0] : enterButton;
      let button: any;
      const isAntdButton =
        enterButtonAsElement.type &&
        isPlainObject(enterButtonAsElement.type) &&
        enterButtonAsElement.type.__ANT_BUTTON;
      if (isAntdButton || enterButtonAsElement.tagName === 'button') {
        button = cloneElement(
          enterButtonAsElement,
          {
            onMousedown,
            onClick: onSearch,
            key: 'enterButton',
            ...(isAntdButton
              ? {
                  class: btnClassName,
                  size: size.value,
                }
              : {}),
          },
          false,
        );
      } else {
        const iconOnly = searchIcon && !enterButton;
        button = (
          <Button
            class={btnClassName}
            type={enterButton ? 'primary' : undefined}
            size={size.value}
            disabled={disabled}
            key="enterButton"
            onMousedown={onMousedown}
            onClick={onSearch}
            loading={loading}
            icon={iconOnly ? searchIcon : null}
          >
            {iconOnly ? null : searchIcon || enterButton}
          </Button>
        );
      }
      if (addonAfter) {
        button = [button, addonAfter];
      }
      const cls = classNames(
        prefixCls.value,
        {
          [`${prefixCls.value}-rtl`]: direction.value === 'rtl',
          [`${prefixCls.value}-${size.value}`]: !!size.value,
          [`${prefixCls.value}-with-button`]: !!enterButton,
        },
        attrs.class,
      );
      return (
        <Input
          ref={inputRef}
          {...omit(restProps, ['onUpdate:value', 'onSearch', 'enterButton'])}
          {...attrs}
          onPressEnter={onSearch}
          size={size.value}
          prefixCls={inputPrefixCls.value}
          addonAfter={button}
          suffix={suffix}
          onChange={onChange}
          class={cls}
          disabled={disabled}
          v-slots={slots}
        />
      );
    };
  },
});
