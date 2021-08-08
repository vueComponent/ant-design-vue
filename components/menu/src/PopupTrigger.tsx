import Trigger from '../../vc-trigger';
import type { PropType } from 'vue';
import { computed, defineComponent, onBeforeUnmount, ref, watch } from 'vue';
import type { MenuMode } from './interface';
import { useInjectMenu } from './hooks/useMenuContext';
import { placements, placementsRtl } from './placements';
import raf from '../../_util/raf';
import classNames from '../../_util/classNames';

const popupPlacementMap = {
  horizontal: 'bottomLeft',
  vertical: 'rightTop',
  'vertical-left': 'rightTop',
  'vertical-right': 'leftTop',
};
export default defineComponent({
  name: 'PopupTrigger',
  inheritAttrs: false,
  props: {
    prefixCls: String,
    mode: String as PropType<MenuMode>,
    visible: Boolean,
    // popup: React.ReactNode;
    popupClassName: String,
    popupOffset: Array as PropType<number[]>,
    disabled: Boolean,
    onVisibleChange: Function as PropType<(visible: boolean) => void>,
  },
  slots: ['popup'],
  emits: ['visibleChange'],
  setup(props, { slots, emit }) {
    const innerVisible = ref(false);
    const {
      getPopupContainer,
      rtl,
      subMenuOpenDelay,
      subMenuCloseDelay,
      builtinPlacements,
      triggerSubMenuAction,
      isRootMenu,
    } = useInjectMenu();

    const placement = computed(() =>
      rtl.value
        ? { ...placementsRtl, ...builtinPlacements.value }
        : { ...placements, ...builtinPlacements.value },
    );

    const popupPlacement = computed(() => popupPlacementMap[props.mode]);

    const visibleRef = ref<number>();
    watch(
      () => props.visible,
      visible => {
        raf.cancel(visibleRef.value);
        visibleRef.value = raf(() => {
          innerVisible.value = visible;
        });
      },
      { immediate: true },
    );
    onBeforeUnmount(() => {
      raf.cancel(visibleRef.value);
    });

    const onVisibleChange = (visible: boolean) => {
      emit('visibleChange', visible);
    };
    return () => {
      const { prefixCls, popupClassName, mode, popupOffset, disabled } = props;
      return (
        <Trigger
          prefixCls={prefixCls}
          popupClassName={classNames(
            `${prefixCls}-popup`,
            {
              [`${prefixCls}-rtl`]: rtl.value,
            },
            popupClassName,
          )}
          stretch={mode === 'horizontal' ? 'minWidth' : null}
          getPopupContainer={
            isRootMenu.value ? getPopupContainer.value : triggerNode => triggerNode.parentNode
          }
          builtinPlacements={placement.value}
          popupPlacement={popupPlacement.value}
          popupVisible={innerVisible.value}
          popupAlign={popupOffset && { offset: popupOffset }}
          action={disabled ? [] : [triggerSubMenuAction.value]}
          mouseEnterDelay={subMenuOpenDelay.value}
          mouseLeaveDelay={subMenuCloseDelay.value}
          onPopupVisibleChange={onVisibleChange}
          forceRender={true}
          v-slots={{
            popup: () => {
              return slots.popup?.({ visible: innerVisible.value });
            },
            default: slots.default,
          }}
        ></Trigger>
      );
    };
  },
});
