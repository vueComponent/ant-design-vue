import { defineComponent, nextTick } from 'vue';
import raf from '../_util/raf';
import ListItem from './ListItem';
import PropTypes, { withUndefined } from '../_util/vue-types';
import { findDOMNode } from '../_util/props-util';
import { getTransitionGroupProps, TransitionGroup } from '../_util/transition';
import type { DataSourceItem } from './list';
const ListBody = defineComponent({
  name: 'ListBody',
  inheritAttrs: false,
  props: {
    prefixCls: PropTypes.string,
    filteredRenderItems: PropTypes.array.def([]),
    lazy: withUndefined(PropTypes.oneOfType([PropTypes.looseBool, PropTypes.object])),
    selectedKeys: PropTypes.array,
    disabled: PropTypes.looseBool,
    onItemSelect: PropTypes.func,
    onItemSelectAll: PropTypes.func,
    onScroll: PropTypes.func,
  },
  setup() {
    return {
      mountId: null,
      lazyId: null,
    };
  },
  data() {
    return {
      mounted: false,
    };
  },
  computed: {
    itemsLength(): number {
      return this.filteredRenderItems ? this.filteredRenderItems.length : 0;
    },
  },
  watch: {
    itemsLength() {
      nextTick(() => {
        const { lazy } = this.$props;
        if (lazy !== false) {
          const container = findDOMNode(this);
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

  beforeUnmount() {
    raf.cancel(this.mountId);
    raf.cancel(this.lazyId);
  },
  methods: {
    handleItemSelect(item: DataSourceItem) {
      const { selectedKeys } = this.$props;
      const checked = selectedKeys.indexOf(item.key) >= 0;
      this.$emit('itemSelect', item.key, !checked);
    },
    handleScroll(e: Event) {
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
    const items = filteredRenderItems.map(({ renderedEl, renderedText, item }: any) => {
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
          onClick={this.handleItemSelect}
        />
      );
    });
    const transitionProps = getTransitionGroupProps(
      mounted ? `${prefixCls}-content-item-highlight` : '',
      {
        tag: 'ul',
        class: `${prefixCls}-content`,
        onScroll: this.handleScroll,
      },
    );
    return <TransitionGroup {...transitionProps}>{items}</TransitionGroup>;
  },
});

export default props => <ListBody {...props} />;
