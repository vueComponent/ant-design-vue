import PropTypes from '../_util/vue-types';
import BaseMixin from '../_util/BaseMixin';
import classnames from 'classnames';
function noop() {}
const scrollTo = (element, to, duration) => {
  const requestAnimationFrame =
    window.requestAnimationFrame ||
    function requestAnimationFrameTimeout() {
      return setTimeout(arguments[0], 10);
    };
  // jump to target if duration zero
  if (duration <= 0) {
    element.scrollTop = to;
    return;
  }
  const difference = to - element.scrollTop;
  const perTick = (difference / duration) * 10;

  requestAnimationFrame(() => {
    element.scrollTop += perTick;
    if (element.scrollTop === to) return;
    scrollTo(element, to, duration - 10);
  });
};

const Select = {
  mixins: [BaseMixin],
  props: {
    prefixCls: PropTypes.string,
    options: PropTypes.array,
    selectedIndex: PropTypes.number,
    type: PropTypes.string,
    // onSelect: PropTypes.func,
    // onMouseEnter: PropTypes.func,
  },
  data() {
    return {
      active: false,
    };
  },

  mounted() {
    this.$nextTick(() => {
      // jump to selected option
      this.scrollToSelected(0);
    });
  },
  watch: {
    selectedIndex() {
      this.$nextTick(() => {
        // smooth scroll to selected option
        this.scrollToSelected(120);
      });
    },
  },
  methods: {
    onSelect(value) {
      const { type } = this;
      this.__emit('select', type, value);
    },

    getOptions() {
      const { options, selectedIndex, prefixCls } = this;
      return options.map((item, index) => {
        const cls = classnames({
          [`${prefixCls}-select-option-selected`]: selectedIndex === index,
          [`${prefixCls}-select-option-disabled`]: item.disabled,
        });
        const onClick = item.disabled
          ? noop
          : () => {
              this.onSelect(item.value);
            };
        return (
          <li role="button" onClick={onClick} class={cls} key={index} disabled={item.disabled}>
            {item.value}
          </li>
        );
      });
    },

    handleMouseEnter(e) {
      this.setState({ active: true });
      this.__emit('mouseenter', e);
    },

    handleMouseLeave() {
      this.setState({ active: false });
    },

    scrollToSelected(duration) {
      // move to selected item
      const select = this.$el;
      const list = this.$refs.list;
      if (!list) {
        return;
      }
      let index = this.selectedIndex;
      if (index < 0) {
        index = 0;
      }
      const topOption = list.children[index];
      const to = topOption.offsetTop;
      scrollTo(select, to, duration);
    },
  },

  render() {
    const { prefixCls, options, active } = this;
    if (options.length === 0) {
      return null;
    }

    const cls = {
      [`${prefixCls}-select`]: 1,
      [`${prefixCls}-select-active`]: active,
    };

    return (
      <div class={cls} onMouseenter={this.handleMouseEnter} onMouseleave={this.handleMouseLeave}>
        <ul ref="list">{this.getOptions()}</ul>
      </div>
    );
  },
};

export default Select;
