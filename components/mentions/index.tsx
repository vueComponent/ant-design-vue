import type { App, PropType, Plugin, ExtractPropTypes } from 'vue';
import { watch, ref, onMounted, defineComponent, nextTick } from 'vue';
import classNames from '../_util/classNames';
import PropTypes from '../_util/vue-types';
import VcMentions from '../vc-mentions';
import { mentionsProps as baseMentionsProps } from '../vc-mentions/src/mentionsProps';
import useConfigInject from '../_util/hooks/useConfigInject';
import { flattenChildren, getOptionProps } from '../_util/props-util';
import { useInjectFormItemContext } from '../form/FormItemContext';
import omit from '../_util/omit';

const { Option } = VcMentions;

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

const getMentions = (value = '', config: MentionsConfig): MentionsEntity[] => {
  const { prefix = '@', split = ' ' } = config || {};
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

const mentionsProps = {
  ...baseMentionsProps,
  loading: PropTypes.looseBool,
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
  notFoundContent: PropTypes.any,
  defaultValue: String,
  id: String,
};

export type MentionsProps = Partial<ExtractPropTypes<typeof mentionsProps>>;

const Mentions = defineComponent({
  name: 'AMentions',
  inheritAttrs: false,
  props: mentionsProps,
  getMentions,
  Option,
  emits: ['update:value', 'change', 'focus', 'blur', 'select', 'pressenter'],
  slots: ['notFoundContent', 'option'],
  setup(props, { slots, emit, attrs, expose }) {
    const { prefixCls, renderEmpty, direction } = useConfigInject('mentions', props);
    const focused = ref(false);
    const vcMentions = ref(null);
    const value = ref(props.value ?? props.defaultValue ?? '');
    const formItemContext = useInjectFormItemContext();
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
      return renderEmpty.value('Select');
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

    onMounted(() => {
      nextTick(() => {
        if (process.env.NODE_ENV === 'test') {
          if (props.autofocus) {
            focus();
          }
        }
      });
    });

    return () => {
      const {
        disabled,
        getPopupContainer,
        rows = 1,
        id = formItemContext.id.value,
        ...restProps
      } = props;
      const { class: className, ...otherAttrs } = attrs;
      const otherProps = omit(restProps, ['defaultValue', 'onUpdate:value', 'prefixCls']);

      const mergedClassName = classNames(className, {
        [`${prefixCls.value}-disabled`]: disabled,
        [`${prefixCls.value}-focused`]: focused.value,
        [`${prefixCls.value}-rtl`]: direction.value === 'rtl',
      });

      const mentionsProps = {
        prefixCls: prefixCls.value,
        ...otherProps,
        disabled,
        direction: direction.value,
        filterOption: props.filterOption,
        getPopupContainer,
        options: props.options || getOptions(),
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
      return (
        <VcMentions
          {...mentionsProps}
          v-slots={{ notFoundContent: getNotFoundContent, option: slots.option }}
        ></VcMentions>
      );
    };
  },
});

export const MentionsOption = {
  ...Option,
  name: 'AMentionsOption',
};

/* istanbul ignore next */
Mentions.install = function (app: App) {
  app.component(Mentions.name, Mentions);
  app.component(MentionsOption.name, MentionsOption);
  return app;
};

export default Mentions as typeof Mentions &
  Plugin & {
    getMentions: typeof getMentions;
    readonly Option: typeof Option;
  };
