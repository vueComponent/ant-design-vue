import { defineComponent, ref, watch, computed } from 'vue';
import type { CSSProperties } from 'vue';
import type { VueNode, Key } from '../../../_util/type';
import PropTypes from '../../../_util/vue-types';

export interface TabPaneProps {
  tab?: VueNode | (() => VueNode);
  disabled?: boolean;
  forceRender?: boolean;
  closable?: boolean;
  closeIcon?: () => VueNode;

  // Pass by TabPaneList
  prefixCls?: string;
  tabKey?: Key;
  id?: string;
  animated?: boolean;
  active?: boolean;
  destroyInactiveTabPane?: boolean;
}

export default defineComponent({
  name: 'TabPane',
  inheritAttrs: false,
  props: {
    tab: PropTypes.any,
    disabled: { type: Boolean },
    forceRender: { type: Boolean },
    closable: { type: Boolean },
    animated: { type: Boolean },
    active: { type: Boolean },
    destroyInactiveTabPane: { type: Boolean },

    // Pass by TabPaneList
    prefixCls: { type: String },
    tabKey: { type: [String, Number] },
    id: { type: String },
  },
  slots: ['closeIcon', 'tab'],
  setup(props, { attrs, slots }) {
    const visited = ref(props.forceRender);
    watch(
      [() => props.active, () => props.destroyInactiveTabPane],
      () => {
        if (props.active) {
          visited.value = true;
        } else if (props.destroyInactiveTabPane) {
          visited.value = false;
        }
      },
      { immediate: true },
    );
    const mergedStyle = computed<CSSProperties>(() => {
      if (!props.active) {
        if (props.animated) {
          return {
            visibility: 'hidden',
            height: 0,
            overflowY: 'hidden',
          };
        } else {
          return { display: 'none' };
        }
      }
      return {};
    });

    return () => {
      const { prefixCls, forceRender, id, active, tabKey } = props;
      return (
        <div
          id={id && `${id}-panel-${tabKey}`}
          role="tabpanel"
          tabindex={active ? 0 : -1}
          aria-labelledby={id && `${id}-tab-${tabKey}`}
          aria-hidden={!active}
          style={{ ...mergedStyle.value, ...(attrs.style as any) }}
          class={[`${prefixCls}-tabpane`, active && `${prefixCls}-tabpane-active`, attrs.class]}
        >
          {(active || visited.value || forceRender) && slots.default?.()}
        </div>
      );
    };
  },
});
