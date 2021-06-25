import type { App, PropType, VNodeTypes, Plugin, ExtractPropTypes } from 'vue';
import { defineComponent, inject, nextTick } from 'vue';
import classNames from '../_util/classNames';
import omit from 'omit.js';
import PropTypes from '../_util/vue-types';
import VcMentions from '../vc-mentions';
import { mentionsProps as baseMentionsProps } from '../vc-mentions/src/mentionsProps';
import Spin from '../spin';
import BaseMixin from '../_util/BaseMixin';
import { defaultConfigProvider } from '../config-provider';
import { getOptionProps, getComponent, getSlot } from '../_util/props-util';
import type { RenderEmptyHandler } from '../config-provider/renderEmpty';

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
  mixins: [BaseMixin],
  inheritAttrs: false,
  Option: { ...Option, name: 'AMentionsOption' },
  getMentions,
  props: mentionsProps,
  emits: ['update:value', 'change', 'focus', 'blur', 'select'],
  setup() {
    return {
      configProvider: inject('configProvider', defaultConfigProvider),
    };
  },
  data() {
    return {
      focused: false,
    };
  },
  mounted() {
    nextTick(() => {
      if (process.env.NODE_ENV === 'test') {
        if (this.autofocus) {
          this.focus();
        }
      }
    });
  },
  methods: {
    handleFocus(e: FocusEvent) {
      this.$emit('focus', e);
      this.setState({
        focused: true,
      });
    },
    handleBlur(e: FocusEvent) {
      this.$emit('blur', e);
      this.setState({
        focused: false,
      });
    },
    handleSelect(...args: [MentionsOptionProps, string]) {
      this.$emit('select', ...args);
      this.setState({
        focused: true,
      });
    },
    handleChange(val: string) {
      this.$emit('update:value', val);
      this.$emit('change', val);
    },
    getNotFoundContent(renderEmpty: RenderEmptyHandler) {
      const notFoundContent = getComponent(this, 'notFoundContent');
      if (notFoundContent !== undefined) {
        return notFoundContent;
      }

      return renderEmpty('Select');
    },
    getOptions() {
      const { loading } = this.$props;
      const children = getSlot(this);

      if (loading) {
        return (
          <Option value="ANTD_SEARCHING" disabled>
            <Spin size="small" />
          </Option>
        );
      }
      return children;
    },
    getFilterOption() {
      const { filterOption, loading } = this.$props;
      if (loading) {
        return loadingFilterOption;
      }
      return filterOption;
    },
    focus() {
      (this.$refs.vcMentions as HTMLTextAreaElement).focus();
    },
    blur() {
      (this.$refs.vcMentions as HTMLTextAreaElement).blur();
    },
  },
  render() {
    const { focused } = this.$data;
    const { getPrefixCls, renderEmpty } = this.configProvider;
    const {
      prefixCls: customizePrefixCls,
      disabled,
      getPopupContainer,
      ...restProps
    } = getOptionProps(this) as any;
    const { class: className, ...otherAttrs } = this.$attrs;
    const prefixCls = getPrefixCls('mentions', customizePrefixCls);
    const otherProps = omit(restProps, ['loading', 'onUpdate:value']);

    const mergedClassName = classNames(className, {
      [`${prefixCls}-disabled`]: disabled,
      [`${prefixCls}-focused`]: focused,
    });

    const mentionsProps = {
      prefixCls,
      notFoundContent: this.getNotFoundContent(renderEmpty),
      ...otherProps,
      disabled,
      filterOption: this.getFilterOption(),
      getPopupContainer,
      children: this.getOptions(),
      class: mergedClassName,
      rows: 1,
      ...otherAttrs,
      onChange: this.handleChange,
      onSelect: this.handleSelect,
      onFocus: this.handleFocus,
      onBlur: this.handleBlur,
      ref: 'vcMentions',
    };

    return <VcMentions {...mentionsProps} />;
  },
});

/* istanbul ignore next */
Mentions.install = function (app: App) {
  app.component(Mentions.name, Mentions);
  app.component(Mentions.Option.name, Mentions.Option);
  return app;
};

export const MentionsOption = Mentions.Option;

export default Mentions as typeof Mentions &
  Plugin & {
    readonly Option: typeof Option;
  };
