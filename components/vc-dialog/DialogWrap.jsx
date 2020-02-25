import Dialog from './Dialog';
import ContainerRender from '../_util/ContainerRender';
import getDialogPropTypes from './IDialogPropTypes';
import { getStyle, getClass, getListeners } from '../_util/props-util';
const IDialogPropTypes = getDialogPropTypes();
let openCount = 0;
const DialogWrap = {
  inheritAttrs: false,
  props: {
    ...IDialogPropTypes,
    visible: IDialogPropTypes.visible.def(false),
  },
  data() {
    openCount = this.visible ? openCount + 1 : openCount;
    this.renderComponent = () => {};
    this.removeContainer = () => {};
    return {};
  },
  watch: {
    visible(val, preVal) {
      openCount = val && !preVal ? openCount + 1 : openCount - 1;
    },
  },
  beforeDestroy() {
    if (this.visible) {
      openCount = openCount ? openCount - 1 : openCount;
      this.renderComponent({
        afterClose: this.removeContainer,
        visible: false,
        on: {
          close() {},
        },
      });
    } else {
      this.removeContainer();
    }
  },
  methods: {
    getComponent(extra = {}) {
      const { $attrs, $props, $slots, getContainer } = this;
      const { on, ...otherProps } = extra;
      const dialogProps = {
        props: {
          ...$props,
          dialogClass: getClass(this),
          dialogStyle: getStyle(this),
          ...otherProps,
          getOpenCount: getContainer === false ? () => 2 : () => openCount,
        },
        attrs: $attrs,
        ref: '_component',
        key: 'dialog',
        on: {
          ...getListeners(this),
          ...on,
        },
      };
      return <Dialog {...dialogProps}>{$slots.default}</Dialog>;
    },

    getContainer2() {
      const container = document.createElement('div');
      if (this.getContainer) {
        this.getContainer().appendChild(container);
      } else {
        document.body.appendChild(container);
      }
      return container;
    },
  },

  render() {
    const { visible } = this;
    return (
      <ContainerRender
        parent={this}
        visible={visible}
        autoDestroy={false}
        getComponent={this.getComponent}
        getContainer={this.getContainer2}
        children={({ renderComponent, removeContainer }) => {
          this.renderComponent = renderComponent;
          this.removeContainer = removeContainer;
          return null;
        }}
      />
    );
  },
};

export default DialogWrap;
