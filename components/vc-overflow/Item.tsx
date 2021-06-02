import {
  computed,
  CSSProperties,
  defineComponent,
  HTMLAttributes,
  onUnmounted,
  PropType,
  ref,
} from 'vue';
import ResizeObserver from '../vc-resize-observer';
import classNames from '../_util/classNames';
import { Key, VueNode } from '../_util/type';
import PropTypes from '../_util/vue-types';

export default defineComponent({
  name: 'Item',
  props: {
    prefixCls: String,
    item: PropTypes.any,
    renderItem: Function as PropType<(item: any) => VueNode>,
    responsive: Boolean,
    itemKey: [String, Number],
    registerSize: Function as PropType<(key: Key, width: number | null) => void>,
    display: Boolean,
    order: Number,
    component: PropTypes.any,
    invalidate: Boolean,
  },
  setup(props, { slots, expose }) {
    const mergedHidden = computed(() => props.responsive && !props.display);
    const itemNodeRef = ref();

    expose({ itemNodeRef });

    // ================================ Effect ================================
    function internalRegisterSize(width: number | null) {
      props.registerSize(props.itemKey!, width);
    }

    onUnmounted(() => {
      internalRegisterSize(null);
    });

    return () => {
      const {
        prefixCls,
        invalidate,
        item,
        renderItem,
        responsive,
        registerSize,
        itemKey,
        display,
        order,
        component: Component = 'div',
        ...restProps
      } = props;
      const children = slots.default?.();
      // ================================ Render ================================
      const childNode = renderItem && item !== undefined ? renderItem(item) : children;

      let overflowStyle: CSSProperties | undefined;
      if (!invalidate) {
        overflowStyle = {
          opacity: mergedHidden.value ? 0 : 1,
          height: mergedHidden.value ? 0 : undefined,
          overflowY: mergedHidden.value ? 'hidden' : undefined,
          order: responsive ? order : undefined,
          pointerEvents: mergedHidden.value ? 'none' : undefined,
        };
      }

      const overflowProps: HTMLAttributes = {};
      if (mergedHidden.value) {
        overflowProps['aria-hidden'] = true;
      }

      let itemNode = (
        <Component
          class={classNames(!invalidate && prefixCls)}
          style={overflowStyle}
          {...overflowProps}
          {...restProps}
          ref={itemNodeRef}
        >
          {childNode}
        </Component>
      );

      if (responsive) {
        itemNode = (
          <ResizeObserver
            onResize={({ offsetWidth }) => {
              internalRegisterSize(offsetWidth);
            }}
          >
            {itemNode}
          </ResizeObserver>
        );
      }

      return itemNode;
    };
  },
});
