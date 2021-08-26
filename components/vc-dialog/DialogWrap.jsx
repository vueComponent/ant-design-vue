import Dialog from './Dialog';
import getDialogPropTypes from './IDialogPropTypes';
import Portal from '../_util/PortalWrapper';
import { getSlot } from '../_util/props-util';
import { defineComponent } from 'vue';
const IDialogPropTypes = getDialogPropTypes();
const DialogWrap = defineComponent({
  inheritAttrs: false,
  props: {
    ...IDialogPropTypes,
    visible: IDialogPropTypes.visible.def(false),
  },

  render() {
    const { visible, getContainer, forceRender } = this.$props;
    let dialogProps = {
      ...this.$props,
      ...this.$attrs,
      ref: '_component',
      key: 'dialog',
    };
    // 渲染在当前 dom 里；
    if (getContainer === false) {
      return (
        <Dialog
          {...dialogProps}
          getOpenCount={() => 2} // 不对 body 做任何操作。。
        >
          {getSlot(this)}
        </Dialog>
      );
    }
    return (
      <Portal
        visible={visible}
        forceRender={forceRender}
        getContainer={getContainer}
        v-slots={{
          default: childProps => {
            dialogProps = { ...dialogProps, ...childProps };
            return <Dialog {...dialogProps}>{getSlot(this)}</Dialog>;
          },
        }}
      />
    );
  },
});

export default DialogWrap;
