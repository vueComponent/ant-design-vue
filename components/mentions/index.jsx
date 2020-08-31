import { inject } from 'vue';
import classNames from '../_util/classNames';
import omit from 'omit.js';
import PropTypes from '../_util/vue-types';
import VcMentions from '../vc-mentions';
import { mentionsProps } from '../vc-mentions/src/mentionsProps';
import Spin from '../spin';
import BaseMixin from '../_util/BaseMixin';
import { ConfigConsumerProps } from '../config-provider';
import { getOptionProps, getComponent, getSlot } from '../_util/props-util';

const { Option } = VcMentions;

function loadingFilterOption() {
  return true;
}

function getMentions(value = '', config) {
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

const Mentions = {
  name: 'AMentions',
  mixins: [BaseMixin],
  inheritAttrs: false,
  Option: { ...Option, name: 'AMentionsOption' },
  getMentions,
  props: {
    ...mentionsProps,
    loading: PropTypes.bool,
    onFocus: PropTypes.func,
    onBlur: PropTypes.func,
    onSelect: PropTypes.func,
    onChange: PropTypes.func,
    'onUpdate:value': PropTypes.func,
  },
  setup() {
    return {
      configProvider: inject('configProvider', ConfigConsumerProps),
    };
  },
  data() {
    return {
      focused: false,
    };
  },
  mounted() {
    this.$nextTick(() => {
      if (process.env.NODE_ENV === 'test') {
        if (this.autofocus) {
          this.focus();
        }
      }
    });
  },
  methods: {
    handleFocus(...args) {
      this.$emit('focus', ...args);
      this.setState({
        focused: true,
      });
    },
    handleBlur(...args) {
      this.$emit('blur', ...args);
      this.setState({
        focused: false,
      });
    },
    handleSelect(...args) {
      this.$emit('select', ...args);
      this.setState({
        focused: true,
      });
    },
    handleChange(val) {
      this.$emit('update:value', val);
      this.$emit('change', val);
    },
    getNotFoundContent(renderEmpty) {
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
      this.$refs.vcMentions.focus();
    },
    blur() {
      this.$refs.vcMentions.blur();
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
    } = getOptionProps(this);
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
};

/* istanbul ignore next */
Mentions.install = function(app) {
  app.component(Mentions.name, Mentions);
  app.component(Mentions.Option.name, Mentions.Option);
};

export default Mentions;
