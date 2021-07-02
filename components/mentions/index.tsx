import type { App, PropType, VNodeTypes, Plugin, ExtractPropTypes } from 'vue';
import { ref, onMounted } from 'vue';
import { defineComponent, nextTick } from 'vue';
import classNames from '../_util/classNames';
import omit from 'omit.js';
import PropTypes from '../_util/vue-types';
import VcMentions from '../vc-mentions';
import { mentionsProps as baseMentionsProps } from '../vc-mentions/src/mentionsProps';
import Spin from '../spin';
import type { RenderEmptyHandler } from '../config-provider/renderEmpty';
import useConfigInject from '../_util/hooks/useConfigInject';

const { Option } = VcMentions;

interface MentionsConfig {
  prefix?: string | string[];
  split?: string;
}

export interface MentionsOptionProps {
  value: string;
  disabled: boolean;
  children: VNodeTypes;
  [key: string]: any;
}

function loadingFilterOption() {
  return true;
}

function getMentions(value = '', config: MentionsConfig) {
  const { prefix = '@', split = ' ' } = config || {};
  const prefixList = Array.isArray(prefix) ? prefix : [prefix];

  return value
    .split(split)
    .map((str = '') => {
      let hitPrefix = null;

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
          value: str.slice(hitPrefix.length),
        };
      }
      return null;
    })
    .filter(entity => !!entity && !!entity.value);
}

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
};

export type MentionsProps = Partial<ExtractPropTypes<typeof mentionsProps>>;

const Mentions = defineComponent({
  name: 'AMentions',
  inheritAttrs: false,
  props: mentionsProps,
  getMentions,
  emits: ['update:value', 'change', 'focus', 'blur', 'select'],
  setup(props, { slots, emit, attrs, expose }) {
    const { prefixCls, renderEmpty, direction } = useConfigInject('mentions', props);
    const focused = ref(false);
    const vcMentions = ref(null);

    const handleFocus = (e: FocusEvent) => {
      focused.value = true;
      emit('focus', e);
    };

    const handleBlur = (e: FocusEvent) => {
      focused.value = false;
      emit('blur', e);
    };

    const handleSelect = (...args: [MentionsOptionProps, string]) => {
      emit('select', ...args);
      focused.value = true;
    };

    const handleChange = (val: string) => {
      emit('update:value', val);
      emit('change', val);
    };

    const getNotFoundContent = (renderEmpty: RenderEmptyHandler) => {
      const notFoundContent = props.notFoundContent;
      if (notFoundContent !== undefined) {
        return notFoundContent;
      }

      return renderEmpty('Select');
    };

    const getOptions = () => {
      const { loading } = props;

      if (loading) {
        return (
          <Option value="ANTD_SEARCHING" disabled>
            <Spin size="small" />
          </Option>
        );
      }
      return slots.default?.();
    };

    const getFilterOption = () => {
      const { filterOption, loading } = props;
      if (loading) {
        return loadingFilterOption;
      }
      return filterOption;
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
      const { disabled, getPopupContainer, ...restProps } = props;
      const { class: className, ...otherAttrs } = attrs;
      const otherProps = omit(restProps, ['loading', 'onUpdate:value', 'prefixCls']);

      const mergedClassName = classNames(className, {
        [`${prefixCls.value}-disabled`]: disabled,
        [`${prefixCls.value}-focused`]: focused.value,
        [`${prefixCls}-rtl`]: direction.value === 'rtl',
      });

      const mentionsProps = {
        prefixCls: prefixCls.value,
        notFoundContent: getNotFoundContent(renderEmpty.value),
        ...otherProps,
        disabled,
        direction: direction.value,
        filterOption: getFilterOption(),
        getPopupContainer,
        children: getOptions(),
        class: mergedClassName,
        rows: 1,
        ...otherAttrs,
        onChange: handleChange,
        onSelect: handleSelect,
        onFocus: handleFocus,
        onBlur: handleBlur,
        ref: vcMentions,
      };
      return <VcMentions {...mentionsProps} />;
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
    readonly Option: typeof Option;
  };
