import PropTypes from '../_util/vue-types';

function IDialogPropTypes() {
  return {
    keyboard: PropTypes.looseBool,
    mask: PropTypes.looseBool,
    afterClose: PropTypes.func,
    // onClose: PropTypes. (e: SyntheticEvent<HTMLDivElement>) =>any,
    closable: PropTypes.looseBool,
    maskClosable: PropTypes.looseBool,
    visible: PropTypes.looseBool,
    destroyOnClose: PropTypes.looseBool,
    mousePosition: PropTypes.shape({
      x: PropTypes.number,
      y: PropTypes.number,
    }).loose,
    title: PropTypes.any,
    footer: PropTypes.any,
    transitionName: PropTypes.string,
    maskTransitionName: PropTypes.string,
    animation: PropTypes.any,
    maskAnimation: PropTypes.any,
    wrapStyle: PropTypes.object,
    bodyStyle: PropTypes.object,
    maskStyle: PropTypes.object,
    prefixCls: PropTypes.string,
    wrapClassName: PropTypes.string,
    width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    zIndex: PropTypes.number,
    bodyProps: PropTypes.any,
    maskProps: PropTypes.any,
    wrapProps: PropTypes.any,
    getContainer: PropTypes.any,
    dialogStyle: PropTypes.object,
    dialogClass: PropTypes.string,
    closeIcon: PropTypes.any,
    forceRender: PropTypes.looseBool,
    getOpenCount: PropTypes.func,
    // https://github.com/ant-design/ant-design/issues/19771
    // https://github.com/react-component/dialog/issues/95
    focusTriggerAfterClose: PropTypes.looseBool,
    onClose: PropTypes.func,
  };
}

export default IDialogPropTypes;
