import PropTypes from '../../_util/vue-types';
import Trigger from '../../vc-trigger';
import { placements } from './placements';
import Content from './Content';
import { getPropsSlot } from '../../_util/props-util';
import type { CSSProperties, PropType } from 'vue';
import { defineComponent, shallowRef, watchEffect } from 'vue';

function noop() {}
export default defineComponent({
  compatConfig: { MODE: 3 },
  name: 'Tooltip',
  inheritAttrs: false,
  props: {
    trigger: PropTypes.any.def(['hover']),
    defaultVisible: { type: Boolean, default: undefined },
    visible: { type: Boolean, default: undefined },
    placement: PropTypes.string.def('right'),
    transitionName: String,
    animation: PropTypes.any,
    afterVisibleChange: PropTypes.func.def(() => {}),
    overlayStyle: { type: Object as PropType<CSSProperties>, default: undefined as CSSProperties },
    overlayClassName: String,
    prefixCls: PropTypes.string.def('rc-tooltip'),
    mouseEnterDelay: PropTypes.number.def(0.1),
    mouseLeaveDelay: PropTypes.number.def(0.1),
    getPopupContainer: Function as PropType<(triggerNode?: HTMLElement) => HTMLElement>,
    destroyTooltipOnHide: { type: Boolean, default: false },
    align: PropTypes.object.def(() => ({})),
    arrowContent: PropTypes.any.def(null),
    tipId: String,
    builtinPlacements: PropTypes.object,
    overlayInnerStyle: {
      type: Object as PropType<CSSProperties>,
      default: undefined as CSSProperties,
    },
    popupVisible: { type: Boolean, default: undefined },
    onVisibleChange: Function,
    onPopupAlign: Function,
    arrow: { type: Boolean, default: true },
  },
  setup(props, { slots, attrs, expose }) {
    const triggerDOM = shallowRef();

    const getPopupElement = () => {
      const { prefixCls, tipId, overlayInnerStyle } = props;

      return [
        !!props.arrow ? (
          <div class={`${prefixCls}-arrow`} key="arrow">
            {getPropsSlot(slots, props, 'arrowContent')}
          </div>
        ) : null,
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

    const destroyTooltip = shallowRef(false);
    const autoDestroy = shallowRef(false);
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
        onPopupVisibleChange: props.onVisibleChange || (noop as any),
        onPopupAlign: props.onPopupAlign || noop,
        ref: triggerDOM,
        arrow: !!props.arrow,
        popup: getPopupElement(),
      };
      return <Trigger {...triggerProps} v-slots={{ default: slots.default }}></Trigger>;
    };
  },
});
