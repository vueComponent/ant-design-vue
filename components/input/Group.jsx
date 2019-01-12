import { filterEmpty } from '../_util/props-util';
export default {
  name: 'AInputGroup',
  props: {
    prefixCls: {
      default: 'ant-input-group',
      type: String,
    },
    size: {
      validator(value) {
        return ['small', 'large', 'default'].includes(value);
      },
    },
    compact: Boolean,
  },
  computed: {
    classes() {
      const { prefixCls, size, compact = false } = this;
      return {
        [`${prefixCls}`]: true,
        [`${prefixCls}-lg`]: size === 'large',
        [`${prefixCls}-sm`]: size === 'small',
        [`${prefixCls}-compact`]: compact,
      };
    },
  },
  methods: {},
  render() {
    const { $listeners } = this;
    return (
      <span class={this.classes} {...{ on: $listeners }}>
        {filterEmpty(this.$slots.default)}
      </span>
    );
  },
};
