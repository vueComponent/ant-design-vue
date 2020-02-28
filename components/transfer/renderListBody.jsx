import raf from '../_util/raf';
import ListItem from './ListItem';
import PropTypes from '../_util/vue-types';
import getTransitionProps from '../_util/getTransitionProps';
function noop() {}
const ListBody = {
  name: 'ListBody',
  inheritAttrs: false,
  props: {
    prefixCls: PropTypes.string,
    filteredRenderItems: PropTypes.array.def([]),
    lazy: PropTypes.oneOfType([PropTypes.bool, PropTypes.object]),
    selectedKeys: PropTypes.array,
    disabled: PropTypes.bool,
  },
  data() {
    return {
      mounted: false,
    };
  },
  computed: {
    itemsLength() {
      return this.filteredRenderItems ? this.filteredRenderItems.length : 0;
    },
  },
  watch: {
    itemsLength() {
      this.$nextTick(() => {
        const { lazy } = this.$props;
        if (lazy !== false) {
          const container = this.$el;
          raf.cancel(this.lazyId);
          this.lazyId = raf(() => {
            if (container) {
              const scrollEvent = new Event('scroll', { bubbles: true });
              container.dispatchEvent(scrollEvent);
            }
          });
        }
      });
    },
  },
  mounted() {
    this.mountId = raf(() => {
      this.mounted = true;
    });
  },

  beforeDestroy() {
    raf.cancel(this.mountId);
    raf.cancel(this.lazyId);
  },
  methods: {
    onItemSelect(item) {
      const { selectedKeys } = this.$props;
      const checked = selectedKeys.indexOf(item.key) >= 0;
      this.$emit('itemSelect', item.key, !checked);
    },
    onScroll(e) {
      this.$emit('scroll', e);
    },
  },
  render() {
    const { mounted } = this.$data;
    const {
      prefixCls,
      filteredRenderItems,
      lazy,
      selectedKeys,
      disabled: globalDisabled,
    } = this.$props;
    const items = filteredRenderItems.map(({ renderedEl, renderedText, item }) => {
      const { disabled } = item;
      const checked = selectedKeys.indexOf(item.key) >= 0;

      return (
        <ListItem
          disabled={globalDisabled || disabled}
          key={item.key}
          item={item}
          lazy={lazy}
          renderedText={renderedText}
          renderedEl={renderedEl}
          checked={checked}
          prefixCls={prefixCls}
          onClick={this.onItemSelect}
        />
      );
    });
    const transitionProps = getTransitionProps(
      mounted ? `${prefixCls}-content-item-highlight` : '',
      {
        tag: 'ul',
        nativeOn: {
          scroll: this.onScroll,
        },
        leave: noop,
      },
    );
    return (
      <transition-group class={`${prefixCls}-content`} {...transitionProps}>
        {items}
      </transition-group>
    );
  },
};

export default (h, props) => <ListBody {...props} />;
