import { onBeforeUpdate, computed, onBeforeUnmount, onMounted, ref, defineComponent } from 'vue';
import classNames from '../_util/classNames';
import {
  FormItemInputContext,
  NoFormStatus,
  useInjectFormItemContext,
} from '../form/FormItemContext';
import useConfigInject from '../config-provider/hooks/useConfigInject';
import { getMergedStatus, getStatusClassNames } from '../_util/statusUtils';
import type { InputFocusOptions } from '../vc-input/utils/commonUtils';
import { hasPrefixSuffix } from '../vc-input/utils/commonUtils';
import VcInput from '../vc-input/Input';
import inputProps from './inputProps';
import omit from '../_util/omit';
import CloseCircleFilled from '@ant-design/icons-vue/CloseCircleFilled';

// CSSINJS
import useStyle from './style';
import { useInjectDisabled } from '../config-provider/DisabledContext';

export default defineComponent({
  compatConfig: { MODE: 3 },
  name: 'AInput',
  inheritAttrs: false,
  props: inputProps(),
  setup(props, { slots, attrs, expose, emit }) {
    const inputRef = ref();
    const formItemContext = useInjectFormItemContext();
    const formItemInputContext = FormItemInputContext.useInject();
    const mergedStatus = computed(() => getMergedStatus(formItemInputContext.status, props.status));
    const { direction, prefixCls, size, autocomplete } = useConfigInject('input', props);

    // Style
    const [wrapSSR, hashId] = useStyle(prefixCls);

    const disabled = useInjectDisabled();

    const focus = (option?: InputFocusOptions) => {
      inputRef.value?.focus(option);
    };

    const blur = () => {
      inputRef.value?.blur();
    };

    const setSelectionRange = (
      start: number,
      end: number,
      direction?: 'forward' | 'backward' | 'none',
    ) => {
      inputRef.value?.setSelectionRange(start, end, direction);
    };

    const select = () => {
      inputRef.value?.select();
    };

    expose({
      focus,
      blur,
      input: inputRef,
      setSelectionRange,
      select,
    });
    // ===================== Remove Password value =====================
    const removePasswordTimeoutRef = ref<any[]>([]);
    const removePasswordTimeout = () => {
      removePasswordTimeoutRef.value.push(
        setTimeout(() => {
          if (
            inputRef.value?.input &&
            inputRef.value?.input.getAttribute('type') === 'password' &&
            inputRef.value?.input.hasAttribute('value')
          ) {
            inputRef.value?.input.removeAttribute('value');
          }
        }),
      );
    };
    onMounted(() => {
      removePasswordTimeout();
    });
    onBeforeUpdate(() => {
      removePasswordTimeoutRef.value.forEach(item => clearTimeout(item));
    });
    onBeforeUnmount(() => {
      removePasswordTimeoutRef.value.forEach(item => clearTimeout(item));
    });

    const handleBlur = (e: FocusEvent) => {
      removePasswordTimeout();
      emit('blur', e);
      formItemContext.onFieldBlur();
    };

    const handleFocus = (e: FocusEvent) => {
      removePasswordTimeout();
      emit('focus', e);
    };

    const triggerChange = (e: Event) => {
      emit('update:value', (e.target as HTMLInputElement).value);
      emit('change', e);
      emit('input', e);
      formItemContext.onFieldChange();
    };

    return () => {
      const { hasFeedback, feedbackIcon } = formItemInputContext;
      const {
        allowClear,
        bordered = true,
        prefix = slots.prefix?.(),
        suffix = slots.suffix?.(),
        addonAfter = slots.addonAfter?.(),
        addonBefore = slots.addonBefore?.(),
        id = formItemContext.id?.value,
        ...rest
      } = props;
      const suffixNode = (hasFeedback || suffix) && (
        <>
          {suffix}
          {hasFeedback && feedbackIcon}
        </>
      );
      const prefixClsValue = prefixCls.value;
      const inputHasPrefixSuffix = hasPrefixSuffix({ prefix, suffix }) || !!hasFeedback;
      const clearIcon = slots.clearIcon || (() => <CloseCircleFilled />);
      return wrapSSR(
        <VcInput
          {...attrs}
          {...omit(rest, ['onUpdate:value', 'onChange', 'onInput'])}
          onChange={triggerChange}
          id={id}
          disabled={props.disabled ?? disabled.value}
          ref={inputRef}
          prefixCls={prefixClsValue}
          autocomplete={autocomplete.value}
          onBlur={handleBlur}
          onFocus={handleFocus}
          suffix={suffixNode}
          allowClear={allowClear}
          addonAfter={addonAfter && <NoFormStatus>{addonAfter}</NoFormStatus>}
          addonBefore={addonBefore && <NoFormStatus>{addonBefore}</NoFormStatus>}
          inputClassName={classNames(
            {
              [`${prefixClsValue}-sm`]: size.value === 'small',
              [`${prefixClsValue}-lg`]: size.value === 'large',
              [`${prefixClsValue}-rtl`]: direction.value === 'rtl',
              [`${prefixClsValue}-borderless`]: !bordered,
            },
            !inputHasPrefixSuffix && getStatusClassNames(prefixClsValue, mergedStatus.value),
            hashId.value,
          )}
          affixWrapperClassName={classNames(
            {
              [`${prefixClsValue}-affix-wrapper-sm`]: size.value === 'small',
              [`${prefixClsValue}-affix-wrapper-lg`]: size.value === 'large',
              [`${prefixClsValue}-affix-wrapper-rtl`]: direction.value === 'rtl',
              [`${prefixClsValue}-affix-wrapper-borderless`]: !bordered,
            },
            getStatusClassNames(`${prefixClsValue}-affix-wrapper`, mergedStatus.value, hasFeedback),
            hashId.value,
          )}
          wrapperClassName={classNames(
            {
              [`${prefixClsValue}-group-rtl`]: direction.value === 'rtl',
            },
            hashId.value,
          )}
          groupClassName={classNames(
            {
              [`${prefixClsValue}-group-wrapper-sm`]: size.value === 'small',
              [`${prefixClsValue}-group-wrapper-lg`]: size.value === 'large',
              [`${prefixClsValue}-group-wrapper-rtl`]: direction.value === 'rtl',
            },
            getStatusClassNames(`${prefixClsValue}-group-wrapper`, mergedStatus.value, hasFeedback),
            hashId.value,
          )}
          v-slots={{ ...slots, clearIcon }}
        ></VcInput>,
      );
    };
  },
});
