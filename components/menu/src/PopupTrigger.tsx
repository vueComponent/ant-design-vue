import Trigger from '../../vc-trigger';
import type { PropType } from 'vue';
import { computed, defineComponent, onBeforeUnmount, shallowRef, watch } from 'vue';
import type { MenuMode } from './interface';
import { useInjectForceRender, useInjectMenu } from './hooks/useMenuContext';
import { placements, placementsRtl } from './placements';
import raf from '../../_util/raf';
import classNames from '../../_util/classNames';
import { getTransitionProps } from '../../_util/transition';
import type { CustomSlotsType } from '../../_util/type';

const popupPlacementMap = {
  horizontal: 'bottomLeft',
  vertical: 'rightTop',
  'vertical-left': 'rightTop',
  'vertical-right': 'leftTop',
};
export default defineComponent({
  compatConfig: { MODE: 3 },
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
  slots: Object as CustomSlotsType<{
    default?: any;
    popup?: any;
  }>,
  emits: ['visibleChange'],
  setup(props, { slots, emit }) {
    const innerVisible = shallowRef(false);
    const {
      getPopupContainer,
      rtl,
      subMenuOpenDelay,
      subMenuCloseDelay,
      builtinPlacements,
      triggerSubMenuAction,
      forceSubMenuRender,
      motion,
      defaultMotions,
      rootClassName,
    } = useInjectMenu();
    const forceRender = useInjectForceRender();
    const placement = computed(() =>
      rtl.value
        ? { ...placementsRtl, ...builtinPlacements.value }
        : { ...placements, ...builtinPlacements.value },
    );

    const popupPlacement = computed(() => popupPlacementMap[props.mode]);

    const visibleRef = shallowRef<number>();
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
    const mergedMotion = computed(() => {
      const m = motion.value || defaultMotions.value?.[props.mode] || defaultMotions.value?.other;
      const res = typeof m === 'function' ? m() : m;
      return res ? getTransitionProps(res.name, { css: true }) : undefined;
    });
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
            rootClassName.value,
          )}
          stretch={mode === 'horizontal' ? 'minWidth' : null}
          getPopupContainer={getPopupContainer.value}
          builtinPlacements={placement.value}
          popupPlacement={popupPlacement.value}
          popupVisible={innerVisible.value}
          popupAlign={popupOffset && { offset: popupOffset }}
          action={disabled ? [] : [triggerSubMenuAction.value]}
          mouseEnterDelay={subMenuOpenDelay.value}
          mouseLeaveDelay={subMenuCloseDelay.value}
          onPopupVisibleChange={onVisibleChange}
          forceRender={forceRender || forceSubMenuRender.value}
          popupAnimation={mergedMotion.value}
          v-slots={{
            popup: slots.popup,
            default: slots.default,
          }}
        ></Trigger>
      );
    };
  },
});
