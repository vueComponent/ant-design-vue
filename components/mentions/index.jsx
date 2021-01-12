import classNames from 'classnames';
import omit from 'omit.js';
import PropTypes from '../_util/vue-types';
import VcMentions from '../vc-mentions';
import { mentionsProps } from '../vc-mentions/src/mentionsProps';
import Base from '../base';
import Spin from '../spin';
import BaseMixin from '../_util/BaseMixin';
import { ConfigConsumerProps } from '../config-provider/configConsumerProps';
import {
  getOptionProps,
  getComponentFromProp,
  getListeners,
  filterEmpty,
} from '../_util/props-util';

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
  model: {
    prop: 'value',
    event: 'change',
  },
  Option: { ...Option, name: 'AMentionsOption' },
  getMentions,
  props: {
    ...mentionsProps,
    loading: PropTypes.bool,
  },
  inject: {
    configProvider: { default: () => ConfigConsumerProps },
  },
  data() {
    return {
      focused: false,
    };
  },
  mounted() {
    this.$nextTick(() => {
      if (this.autoFocus) {
        this.focus();
      }
    });
  },
  methods: {
    onFocus(...args) {
      this.$emit('focus', ...args);
      this.setState({
        focused: true,
      });
    },
    onBlur(...args) {
      this.$emit('blur', ...args);
      this.setState({
        focused: false,
      });
    },
    onSelect(...args) {
      this.$emit('select', ...args);
      this.setState({
        focused: true,
      });
    },
    onChange(val) {
      this.$emit('change', val);
    },
    getNotFoundContent(renderEmpty) {
      const h = this.$createElement;
      const notFoundContent = getComponentFromProp(this, 'notFoundContent');
      if (notFoundContent !== undefined) {
        return notFoundContent;
      }

      return renderEmpty(h, 'Select');
    },
    getOptions() {
      const { loading } = this.$props;
      const children = filterEmpty(this.$slots.default || []);

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
    const prefixCls = getPrefixCls('mentions', customizePrefixCls);
    const otherProps = omit(restProps, ['loading']);

    const mergedClassName = classNames({
      [`${prefixCls}-disabled`]: disabled,
      [`${prefixCls}-focused`]: focused,
    });

    const mentionsProps = {
      props: {
        prefixCls,
        notFoundContent: this.getNotFoundContent(renderEmpty),
        ...otherProps,
        disabled,
        filterOption: this.getFilterOption(),
        getPopupContainer,
        children: this.getOptions(),
      },
      class: mergedClassName,
      attrs: { rows: 1, ...this.$attrs },
      on: {
        ...getListeners(this),
        change: this.onChange,
        select: this.onSelect,
        focus: this.onFocus,
        blur: this.onBlur,
      },
      ref: 'vcMentions',
    };

    return <VcMentions {...mentionsProps} />;
  },
};

/* istanbul ignore next */
Mentions.install = function(Vue) {
  Vue.use(Base);
  Vue.component(Mentions.name, Mentions);
  Vue.component(Mentions.Option.name, Mentions.Option);
};

export default Mentions;
