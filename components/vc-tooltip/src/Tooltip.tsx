import PropTypes from '../../_util/vue-types';
import Trigger from '../../vc-trigger';
import { placements } from './placements';
import Content from './Content';
import { getPropsSlot } from '../../_util/props-util';
import { defineComponent, ref, watchEffect } from 'vue';
function noop() {}
export default defineComponent({
  name: 'Tooltip',
  inheritAttrs: false,
  props: {
    trigger: PropTypes.any.def(['hover']),
    defaultVisible: PropTypes.looseBool,
    visible: PropTypes.looseBool,
    placement: PropTypes.string.def('right'),
    transitionName: PropTypes.string,
    animation: PropTypes.any,
    afterVisibleChange: PropTypes.func.def(() => {}),
    overlayStyle: PropTypes.style,
    overlayClassName: PropTypes.string,
    prefixCls: PropTypes.string.def('rc-tooltip'),
    mouseEnterDelay: PropTypes.number.def(0.1),
    mouseLeaveDelay: PropTypes.number.def(0.1),
    getTooltipContainer: PropTypes.func,
    destroyTooltipOnHide: PropTypes.looseBool.def(false),
    align: PropTypes.object.def(() => ({})),
    arrowContent: PropTypes.any.def(null),
    tipId: PropTypes.string,
    builtinPlacements: PropTypes.object,
    overlayInnerStyle: PropTypes.style,
    popupVisible: PropTypes.looseBool,
    onVisibleChange: PropTypes.func,
    onPopupAlign: PropTypes.func,
  },
  slots: ['arrowContent', 'overlay'],
  setup(props, { slots, attrs, expose }) {
    const triggerDOM = ref();

    const getPopupElement = () => {
      const { prefixCls, tipId, overlayInnerStyle } = props;
      return [
        <div class={`${prefixCls}-arrow`} key="arrow">
          {getPropsSlot(slots, props, 'arrowContent')}
        </div>,
        <Content
          key="content"
          prefixCls={prefixCls}
          id={tipId}
          overlayInnerStyle={overlayInnerStyle}
          v-slots={{ overlay: slots.overlay }}
        />,
      ];
    };

    const getPopupDomNode = () => {
      return triggerDOM.value.getPopupDomNode();
    };

    expose({
      getPopupDomNode,
      triggerDOM,
      forcePopupAlign: () => triggerDOM.value?.forcePopupAlign(),
    });

    const destroyTooltip = ref(false);
    const autoDestroy = ref(false);
    watchEffect(() => {
      const { destroyTooltipOnHide } = props;
      if (typeof destroyTooltipOnHide === 'boolean') {
        destroyTooltip.value = destroyTooltipOnHide;
      } else if (destroyTooltipOnHide && typeof destroyTooltipOnHide === 'object') {
        const { keepParent } = destroyTooltipOnHide;
        destroyTooltip.value = keepParent === true;
        autoDestroy.value = keepParent === false;
      }
    });

    return () => {
      const {
        overlayClassName,
        trigger,
        mouseEnterDelay,
        mouseLeaveDelay,
        overlayStyle,
        prefixCls,
        afterVisibleChange,
        transitionName,
        animation,
        placement,
        align,
        destroyTooltipOnHide,
        defaultVisible,
        getTooltipContainer,
        ...restProps
      } = props;
      const extraProps = { ...restProps };
      if (props.visible !== undefined) {
        extraProps.popupVisible = props.visible;
      }

      const triggerProps = {
        popupClassName: overlayClassName,
        prefixCls,
        action: trigger,
        builtinPlacements: placements,
        popupPlacement: placement,
        popupAlign: align,
        getPopupContainer: getTooltipContainer,
        afterPopupVisibleChange: afterVisibleChange,
        popupTransitionName: transitionName,
        popupAnimation: animation,
        defaultPopupVisible: defaultVisible,
        destroyPopupOnHide: destroyTooltip.value,
        autoDestroy: autoDestroy.value,
        mouseLeaveDelay,
        popupStyle: overlayStyle,
        mouseEnterDelay,
        ...extraProps,
        ...attrs,
        onPopupVisibleChange: props.onVisibleChange || noop,
        onPopupAlign: props.onPopupAlign || noop,
        ref: triggerDOM,
        popup: getPopupElement(),
      };
      return <Trigger {...triggerProps} v-slots={{ default: slots.default }}></Trigger>;
    };
  },
});
