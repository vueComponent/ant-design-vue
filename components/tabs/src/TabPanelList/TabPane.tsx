import { defineComponent, ref, watch } from 'vue';
import type { CSSProperties, ExtractPropTypes } from 'vue';
import PropTypes from '../../../_util/vue-types';
import type { CustomSlotsType } from '../../../_util/type';
import Transition, { getTransitionProps } from '../../../_util/transition';

const tabPaneProps = () => ({
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
  // closeIcon: PropTypes.any,
});

export type TabPaneProps = Partial<ExtractPropTypes<ReturnType<typeof tabPaneProps>>>;

export default defineComponent({
  compatConfig: { MODE: 3 },
  name: 'ATabPane',
  inheritAttrs: false,
  __ANT_TAB_PANE: true,
  props: tabPaneProps(),
  slots: Object as CustomSlotsType<{
    closeIcon: any;
    tab: any;
    default: any;
  }>,
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

    return () => {
      const { prefixCls, forceRender, id, active, tabKey } = props;

      const tabPaneEl = active && (
        <div
          v-show={active}
          id={id && `${id}-panel-${tabKey}`}
          role="tabpanel"
          tabindex={active ? 0 : -1}
          aria-labelledby={id && `${id}-tab-${tabKey}`}
          aria-hidden={!active}
          style={[attrs.style as CSSProperties]}
          class={[`${prefixCls}-tabpane`, attrs.class]}
        >
          {(active || visited.value || forceRender) && slots.default?.()}
        </div>
      );

      if (props.animated) {
        const transitionProps = getTransitionProps(`${prefixCls}-switch`);
        return <Transition {...transitionProps}>{tabPaneEl}</Transition>;
      } else {
        return tabPaneEl;
      }
    };
  },
});
