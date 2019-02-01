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
    element.scrollTop = element.scrollTop + perTick;
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
        let onClick = noop;
        if (!item.disabled) {
          onClick = this.onSelect.bind(this, item.value);
        }
        return (
          <li class={cls} key={index} onClick={onClick} disabled={item.disabled}>
            {item.value}
          </li>
        );
      });
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

    handleMouseEnter(e) {
      this.setState({ active: true });
      this.__emit('mouseenter', e);
    },

    handleMouseLeave() {
      this.setState({ active: false });
    },
  },

  render() {
    if (this.options.length === 0) {
      return null;
    }

    const { prefixCls } = this;
    const cls = {
      [`${prefixCls}-select`]: 1,
      [`${prefixCls}-select-active`]: this.active,
    };

    return (
      <div class={cls} onMouseenter={this.handleMouseEnter} onMouseleave={this.handleMouseLeave}>
        <ul ref="list">{this.getOptions()}</ul>
      </div>
    );
  },
};

export default Select;
