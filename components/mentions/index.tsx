import type { App, PropType, ExtractPropTypes } from 'vue';
import { computed, watch, shallowRef, defineComponent } from 'vue';
import classNames from '../_util/classNames';
import PropTypes from '../_util/vue-types';
import VcMentions from '../vc-mentions';
import { mentionsProps as baseMentionsProps } from '../vc-mentions/src/mentionsProps';
import useConfigInject from '../config-provider/hooks/useConfigInject';
import { flattenChildren, getOptionProps } from '../_util/props-util';
import { FormItemInputContext, useInjectFormItemContext } from '../form/FormItemContext';
import omit from '../_util/omit';
import { optionProps, optionOptions } from '../vc-mentions/src/Option';
import type { KeyboardEventHandler } from '../_util/EventInterface';
import type { InputStatus } from '../_util/statusUtils';
import { getStatusClassNames, getMergedStatus } from '../_util/statusUtils';
import useStyle from './style';
import { useProvideOverride } from '../menu/src/OverrideContext';
import warning from '../_util/warning';
import Spin from '../spin';
import devWarning from '../vc-util/devWarning';
import type { CustomSlotsType } from '../_util/type';

interface MentionsConfig {
  prefix?: string | string[];
  split?: string;
}

export interface MentionsOptionProps {
  value: string;
  disabled?: boolean;
  label?: string | number | ((o: MentionsOptionProps) => any);
  [key: string]: any;
}

interface MentionsEntity {
  prefix: string;
  value: string;
}

export type MentionPlacement = 'top' | 'bottom';

function loadingFilterOption() {
  return true;
}
const getMentions = (value = '', config: MentionsConfig = {}): MentionsEntity[] => {
  const { prefix = '@', split = ' ' } = config;
  const prefixList: string[] = Array.isArray(prefix) ? prefix : [prefix];

  return value
    .split(split)
    .map((str = ''): MentionsEntity | null => {
      let hitPrefix: string | null = null;

      prefixList.some(prefixStr => {
        const startStr = str.slice(0, prefixStr.length);
        if (startStr === prefixStr) {
          hitPrefix = prefixStr;
          return true;
        }
        return false;
      });

      if (hitPrefix !== null) {
        return {
          prefix: hitPrefix,
          value: str.slice((hitPrefix as string).length),
        };
      }
      return null;
    })
    .filter((entity): entity is MentionsEntity => !!entity && !!entity.value);
};

export const mentionsProps = () => ({
  ...baseMentionsProps,
  loading: { type: Boolean, default: undefined },
  onFocus: {
    type: Function as PropType<(e: FocusEvent) => void>,
  },
  onBlur: {
    type: Function as PropType<(e: FocusEvent) => void>,
  },
  onSelect: {
    type: Function as PropType<(option: MentionsOptionProps, prefix: string) => void>,
  },
  onChange: {
    type: Function as PropType<(text: string) => void>,
  },
  onPressenter: {
    type: Function as PropType<KeyboardEventHandler>,
  },
  'onUpdate:value': {
    type: Function as PropType<(text: string) => void>,
  },
  notFoundContent: PropTypes.any,
  defaultValue: String,
  id: String,
  status: String as PropType<InputStatus>,
});

export type MentionsProps = Partial<ExtractPropTypes<ReturnType<typeof mentionsProps>>>;

const Mentions = defineComponent({
  compatConfig: { MODE: 3 },
  name: 'AMentions',
  inheritAttrs: false,
  props: mentionsProps(),
  slots: Object as CustomSlotsType<{
    notFoundContent?: any;
    option?: any;
    default?: any;
  }>,
  setup(props, { slots, emit, attrs, expose }) {
    // =================== Warning =====================
    if (process.env.NODE_ENV !== 'production') {
      devWarning(
        !flattenChildren(slots.default?.() || []).length,
        'Mentions',
        '`Mentions.Option` is deprecated. Please use `options` instead.',
      );
    }
    const { prefixCls, renderEmpty, direction } = useConfigInject('mentions', props);
    const [wrapSSR, hashId] = useStyle(prefixCls);
    const focused = shallowRef(false);
    const vcMentions = shallowRef(null);
    const value = shallowRef(props.value ?? props.defaultValue ?? '');
    const formItemContext = useInjectFormItemContext();
    const formItemInputContext = FormItemInputContext.useInject();
    const mergedStatus = computed(() => getMergedStatus(formItemInputContext.status, props.status));
    useProvideOverride({
      prefixCls: computed(() => `${prefixCls.value}-menu`),
      mode: computed(() => 'vertical'),
      selectable: computed(() => false),
      onClick: () => {},
      validator: ({ mode }) => {
        // Warning if use other mode
        warning(
          !mode || mode === 'vertical',
          'Mentions',
          `mode="${mode}" is not supported for Mentions's Menu.`,
        );
      },
    });
    watch(
      () => props.value,
      val => {
        value.value = val;
      },
    );
    const handleFocus = (e: FocusEvent) => {
      focused.value = true;
      emit('focus', e);
    };

    const handleBlur = (e: FocusEvent) => {
      focused.value = false;
      emit('blur', e);
      formItemContext.onFieldBlur();
    };

    const handleSelect = (...args: [MentionsOptionProps, string]) => {
      emit('select', ...args);
      focused.value = true;
    };

    const handleChange = (val: string) => {
      if (props.value === undefined) {
        value.value = val;
      }
      emit('update:value', val);
      emit('change', val);
      formItemContext.onFieldChange();
    };

    const getNotFoundContent = () => {
      const notFoundContent = props.notFoundContent;
      if (notFoundContent !== undefined) {
        return notFoundContent;
      }
      if (slots.notFoundContent) {
        return slots.notFoundContent();
      }
      return renderEmpty('Select');
    };

    const getOptions = () => {
      return flattenChildren(slots.default?.() || []).map(item => {
        return { ...getOptionProps(item), label: (item.children as any)?.default?.() };
      });
    };

    const focus = () => {
      (vcMentions.value as HTMLTextAreaElement).focus();
    };

    const blur = () => {
      (vcMentions.value as HTMLTextAreaElement).blur();
    };

    expose({ focus, blur });
    const mentionsfilterOption = computed(() =>
      props.loading ? loadingFilterOption : props.filterOption,
    );
    return () => {
      const {
        disabled,
        getPopupContainer,
        rows = 1,
        id = formItemContext.id.value,
        ...restProps
      } = props;
      const { hasFeedback, feedbackIcon } = formItemInputContext;
      const { class: className, ...otherAttrs } = attrs;
      const otherProps = omit(restProps, ['defaultValue', 'onUpdate:value', 'prefixCls']);

      const mergedClassName = classNames(
        {
          [`${prefixCls.value}-disabled`]: disabled,
          [`${prefixCls.value}-focused`]: focused.value,
          [`${prefixCls.value}-rtl`]: direction.value === 'rtl',
        },
        getStatusClassNames(prefixCls.value, mergedStatus.value),
        !hasFeedback && className,
        hashId.value,
      );

      const mentionsProps = {
        prefixCls: prefixCls.value,
        ...otherProps,
        disabled,
        direction: direction.value,
        filterOption: mentionsfilterOption.value,
        getPopupContainer,
        options: props.loading
          ? [
              {
                value: 'ANTDV_SEARCHING',
                disabled: true,
                label: <Spin size="small" />,
              },
            ]
          : props.options || getOptions(),
        class: mergedClassName,
        ...otherAttrs,
        rows,
        onChange: handleChange,
        onSelect: handleSelect,
        onFocus: handleFocus,
        onBlur: handleBlur,
        ref: vcMentions,
        value: value.value,
        id,
      };
      const mentions = (
        <VcMentions
          {...mentionsProps}
          dropdownClassName={hashId.value}
          v-slots={{ notFoundContent: getNotFoundContent, option: slots.option }}
        ></VcMentions>
      );
      if (hasFeedback) {
        return wrapSSR(
          <div
            class={classNames(
              `${prefixCls.value}-affix-wrapper`,
              getStatusClassNames(
                `${prefixCls.value}-affix-wrapper`,
                mergedStatus.value,
                hasFeedback,
              ),
              className,
              hashId.value,
            )}
          >
            {mentions}
            <span class={`${prefixCls.value}-suffix`}>{feedbackIcon}</span>
          </div>,
        );
      }
      return wrapSSR(mentions);
    };
  },
});

/* istanbul ignore next */
export const MentionsOption = defineComponent({
  compatConfig: { MODE: 3 },
  ...optionOptions,
  name: 'AMentionsOption',
  props: optionProps,
});

export default Object.assign(Mentions, {
  Option: MentionsOption,
  getMentions,
  install: (app: App) => {
    app.component(Mentions.name, Mentions);
    app.component(MentionsOption.name, MentionsOption);
    return app;
  },
});
