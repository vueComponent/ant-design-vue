import type { ExtractPropTypes } from 'vue';
import PropTypes from '../_util/vue-types';

function dialogPropTypes() {
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
    wrapStyle: PropTypes.object,
    bodyStyle: PropTypes.object,
    maskStyle: PropTypes.object,
    prefixCls: String,
    wrapClassName: String,
    width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    zIndex: Number,
    bodyProps: PropTypes.any,
    maskProps: PropTypes.any,
    wrapProps: PropTypes.any,
    getContainer: PropTypes.any,
    dialogStyle: PropTypes.object,
    dialogClass: String,
    closeIcon: PropTypes.any,
    forceRender: { type: Boolean, default: undefined },
    getOpenCount: Function,
    // https://github.com/ant-design/ant-design/issues/19771
    // https://github.com/react-component/dialog/issues/95
    focusTriggerAfterClose: { type: Boolean, default: undefined },
    onClose: Function,
    modalRender: Function,
  };
}
export type IDialogChildProps = Partial<ExtractPropTypes<ReturnType<typeof dialogPropTypes>>>;
export default dialogPropTypes;
