import Dialog from './Dialog';
import getDialogPropTypes from './IDialogPropTypes';
import { getListeners } from '../_util/props-util';
import Portal from '../_util/PortalWrapper';
const IDialogPropTypes = getDialogPropTypes();
const DialogWrap = {
  inheritAttrs: false,
  props: {
    ...IDialogPropTypes,
    visible: IDialogPropTypes.visible.def(false),
  },

  render() {
    const { visible, getContainer, forceRender } = this.$props;
    const dialogProps = {
      props: this.$props,
      attrs: this.$attrs,
      ref: '_component',
      key: 'dialog',
      on: getListeners(this),
    };
    // 渲染在当前 dom 里；
    if (getContainer === false) {
      return (
        <Dialog
          {...dialogProps}
          getOpenCount={() => 2} // 不对 body 做任何操作。。
        >
          {this.$slots.default}
        </Dialog>
      );
    }
    return (
      <Portal
        visible={visible}
        forceRender={forceRender}
        getContainer={getContainer}
        children={childProps => {
          dialogProps.props = { ...dialogProps.props, ...childProps };
          return <Dialog {...dialogProps}>{this.$slots.default}</Dialog>;
        }}
      />
    );
  },
};

export default DialogWrap;
