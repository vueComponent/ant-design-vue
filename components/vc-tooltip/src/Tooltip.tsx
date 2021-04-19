import PropTypes from '../../_util/vue-types';
import Trigger from '../../vc-trigger';
import { placements } from './placements';
import Content from './Content';
import { getPropsSlot } from '../../_util/props-util';
import { defineComponent, ref } from 'vue';
function noop() {}
export default defineComponent({
  name: 'Tooltip',
  inheritAttrs: false,
  props: {
    trigger: PropTypes.any.def(['hover']),
    defaultVisible: PropTypes.looseBool,
    visible: PropTypes.looseBool,
    placement: PropTypes.string.def('right'),
    transitionName: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    animation: PropTypes.any,
    afterVisibleChange: PropTypes.func.def(() => {}),
    overlay: PropTypes.any,
    overlayStyle: PropTypes.object,
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
  },
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
          trigger={triggerDOM}
          prefixCls={prefixCls}
          id={tipId}
          overlay={getPropsSlot(slots, props, 'overlay')}
          overlayInnerStyle={overlayInnerStyle}
        />,
      ];
    };

    const getPopupDomNode = () => {
      return triggerDOM.value.getPopupDomNode();
    };

    expose({ getPopupDomNode });

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
        destroyPopupOnHide: destroyTooltipOnHide,
        mouseLeaveDelay,
        popupStyle: overlayStyle,
        mouseEnterDelay,
        popupVisible: props.visible,
        ...extraProps,
        ...attrs,
        onPopupVisibleChange: attrs.onVisibleChange || noop,
        onPopupAlign: attrs.onPopupAlign || noop,
        ref: triggerDOM,
        popup: getPopupElement(),
      };
      return <Trigger {...triggerProps}>{slots.default?.()}</Trigger>;
    };
  },
});
