import { computed, defineComponent, ref, watch } from 'vue';
import PropTypes from '../_util/vue-types';
import Trigger from '../vc-trigger';
import placements from './placements';
import { cloneElement } from '../_util/vnode';
import classNames from '../_util/classNames';

export default defineComponent({
  props: {
    minOverlayWidthMatchTrigger: PropTypes.looseBool,
    arrow: PropTypes.looseBool.def(false),
    prefixCls: PropTypes.string.def('rc-dropdown'),
    transitionName: PropTypes.string,
    overlayClassName: PropTypes.string.def(''),
    openClassName: PropTypes.string,
    animation: PropTypes.any,
    align: PropTypes.object,
    overlayStyle: PropTypes.style,
    placement: PropTypes.string.def('bottomLeft'),
    overlay: PropTypes.any,
    trigger: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.string)]).def(
      'hover',
    ),
    alignPoint: PropTypes.looseBool,
    showAction: PropTypes.array,
    hideAction: PropTypes.array,
    getPopupContainer: PropTypes.func,
    visible: PropTypes.looseBool,
    defaultVisible: PropTypes.looseBool.def(false),
    mouseEnterDelay: PropTypes.number.def(0.15),
    mouseLeaveDelay: PropTypes.number.def(0.1),
  },
  emits: ['visibleChange', 'overlayClick'],
  slots: ['overlay'],
  setup(props, { slots, emit, expose }) {
    const triggerVisible = ref(!!props.visible);
    watch(
      () => props.visible,
      val => {
        if (val !== undefined) {
          triggerVisible.value = val;
        }
      },
    );
    const triggerRef = ref();

    expose({
      triggerRef,
    });

    const onClick = (e: MouseEvent) => {
      if (props.visible === undefined) {
        triggerVisible.value = false;
      }

      emit('overlayClick', e);
    };

    const onVisibleChange = (visible: boolean) => {
      if (props.visible === undefined) {
        triggerVisible.value = visible;
      }
      emit('visibleChange', visible);
    };

    const getMenuElement = () => {
      const overlayElement = slots.overlay?.();
      const extraOverlayProps = {
        prefixCls: `${props.prefixCls}-menu`,
        onClick,
        getPopupContainer: () => triggerRef.value.getPopupDomNode(),
      };
      return (
        <>
          {props.arrow && <div class={`${props.prefixCls}-arrow`} />}
          {cloneElement(overlayElement, extraOverlayProps, false)}
        </>
      );
    };

    const minOverlayWidthMatchTrigger = computed(() => {
      const { minOverlayWidthMatchTrigger: matchTrigger = !props.alignPoint } = props;
      return matchTrigger;
    });

    const renderChildren = () => {
      const children = slots.default?.();
      return triggerVisible.value && children
        ? cloneElement(
            children[0],
            { class: props.openClassName || `${props.prefixCls}-open` },
            false,
          )
        : children;
    };

    const triggerHideAction = computed(() => {
      if (!props.hideAction && props.trigger.indexOf('contextmenu') !== -1) {
        return ['click'];
      }
      return props.hideAction;
    });
    return () => {
      const {
        prefixCls,
        arrow,
        showAction,
        overlayStyle,
        trigger,
        placement,
        align,
        getPopupContainer,
        transitionName,
        animation,
        overlayClassName,
        ...otherProps
      } = props;
      return (
        <Trigger
          {...otherProps}
          prefixCls={prefixCls}
          ref={triggerRef}
          popupClassName={classNames(overlayClassName, {
            [`${prefixCls}-show-arrow`]: arrow,
          })}
          popupStyle={overlayStyle}
          builtinPlacements={placements}
          action={trigger}
          showAction={showAction}
          hideAction={triggerHideAction.value || []}
          popupPlacement={placement}
          popupAlign={align}
          popupTransitionName={transitionName}
          popupAnimation={animation}
          popupVisible={triggerVisible.value}
          stretch={minOverlayWidthMatchTrigger.value ? 'minWidth' : ''}
          onPopupVisibleChange={onVisibleChange}
          getPopupContainer={getPopupContainer}
          v-slots={{ popup: getMenuElement, default: renderChildren }}
        ></Trigger>
      );
    };
  },
});
