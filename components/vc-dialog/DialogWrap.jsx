import Dialog from './Dialog';
import ContainerRender from '../_util/ContainerRender';
import getDialogPropTypes from './IDialogPropTypes';
import { getStyle, getClass } from '../_util/props-util';
const IDialogPropTypes = getDialogPropTypes();
const DialogWrap = {
  props: {
    ...IDialogPropTypes,
    visible: IDialogPropTypes.visible.def(false),
  },
  data() {
    this.renderComponent = () => {};
    this.removeContainer = () => {};
    return {};
  },

  beforeDestroy() {
    if (this.visible) {
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
      const { $attrs, $listeners, $props, $slots } = this;
      const { on, ...otherProps } = extra;
      const dialogProps = {
        props: {
          ...$props,
          dialogClass: getClass(this),
          dialogStyle: getStyle(this),
          ...otherProps,
        },
        attrs: $attrs,
        ref: '_component',
        key: 'dialog',
        on: {
          ...$listeners,
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
