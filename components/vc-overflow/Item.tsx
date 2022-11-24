import type { CSSProperties, HTMLAttributes, PropType } from 'vue';
import { computed, defineComponent, onUnmounted, ref } from 'vue';
import ResizeObserver from '../vc-resize-observer';
import classNames from '../_util/classNames';
import type { Key, VueNode } from '../_util/type';
import PropTypes from '../_util/vue-types';

const UNDEFINED = undefined;

export default defineComponent({
  compatConfig: { MODE: 3 },
  name: 'Item',
  props: {
    prefixCls: String,
    item: PropTypes.any,
    renderItem: Function as PropType<(item: any) => VueNode>,
    responsive: Boolean,
    itemKey: { type: [String, Number] as PropType<string | number> },
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
      props.registerSize(props.itemKey, width);
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
      const childNode = renderItem && item !== UNDEFINED ? renderItem(item) : children;

      let overflowStyle: CSSProperties | undefined;
      if (!invalidate) {
        overflowStyle = {
          opacity: mergedHidden.value ? 0 : 1,
          height: mergedHidden.value ? 0 : UNDEFINED,
          overflowY: mergedHidden.value ? 'hidden' : UNDEFINED,
          order: responsive ? order : UNDEFINED,
          pointerEvents: mergedHidden.value ? 'none' : UNDEFINED,
          position: mergedHidden.value ? 'absolute' : UNDEFINED,
        };
      }

      const overflowProps: HTMLAttributes = {};
      if (mergedHidden.value) {
        overflowProps['aria-hidden'] = true;
      }

      // 使用 disabled  避免结构不一致 导致子组件 rerender
      return (
        <ResizeObserver
          disabled={!responsive}
          onResize={({ offsetWidth }) => {
            internalRegisterSize(offsetWidth);
          }}
          v-slots={{
            default: () => (
              <Component
                class={classNames(!invalidate && prefixCls)}
                style={overflowStyle}
                {...overflowProps}
                {...restProps}
                ref={itemNodeRef}
              >
                {childNode}
              </Component>
            ),
          }}
        ></ResizeObserver>
      );
    };
  },
});
