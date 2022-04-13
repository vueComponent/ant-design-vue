import type { CSSProperties, ExtractPropTypes, PropType } from 'vue';
import PropTypes from '../_util/vue-types';

export function dialogPropTypes() {
  return {
    keyboard: { type: Boolean, default: undefined },
    mask: { type: Boolean, default: undefined },
    afterClose: Function,
    closable: { type: Boolean, default: undefined },
    maskClosable: { type: Boolean, default: undefined },
    visible: { type: Boolean, default: undefined },
    destroyOnClose: { type: Boolean, default: undefined },
    mousePosition: PropTypes.shape({
      x: Number,
      y: Number,
    }).loose,
    title: PropTypes.any,
    footer: PropTypes.any,
    transitionName: String,
    maskTransitionName: String,
    animation: PropTypes.any,
    maskAnimation: PropTypes.any,
    wrapStyle: { type: Object as PropType<CSSProperties>, default: undefined as CSSProperties },
    bodyStyle: { type: Object as PropType<CSSProperties>, default: undefined as CSSProperties },
    maskStyle: { type: Object as PropType<CSSProperties>, default: undefined as CSSProperties },
    prefixCls: String,
    wrapClassName: String,
    rootClassName: String,
    width: [String, Number],
    height: [String, Number],
    zIndex: Number,
    bodyProps: PropTypes.any,
    maskProps: PropTypes.any,
    wrapProps: PropTypes.any,
    getContainer: PropTypes.any,
    dialogStyle: { type: Object as PropType<CSSProperties>, default: undefined as CSSProperties },
    dialogClass: String,
    closeIcon: PropTypes.any,
    forceRender: { type: Boolean, default: undefined },
    getOpenCount: Function as PropType<() => number>,
    // https://github.com/ant-design/ant-design/issues/19771
    // https://github.com/react-component/dialog/issues/95
    focusTriggerAfterClose: { type: Boolean, default: undefined },
    onClose: Function as PropType<(e: MouseEvent | KeyboardEvent) => void>,
    modalRender: Function,
  };
}
export type IDialogChildProps = Partial<ExtractPropTypes<ReturnType<typeof dialogPropTypes>>>;
export default dialogPropTypes;
