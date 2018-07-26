import _objectWithoutProperties from 'babel-runtime/helpers/objectWithoutProperties';
import _extends from 'babel-runtime/helpers/extends';

import Dialog from './Dialog';
import ContainerRender from '../_util/ContainerRender';
import getDialogPropTypes from './IDialogPropTypes';
import { getStyle, getClass } from '../_util/props-util';
var IDialogPropTypes = getDialogPropTypes();
var DialogWrap = {
  props: _extends({}, IDialogPropTypes, {
    visible: IDialogPropTypes.visible.def(false)
  }),
  data: function data() {
    this.renderComponent = function () {};

    this.removeContainer = function () {};
    return {};
  },
  beforeDestroy: function beforeDestroy() {
    if (this.visible) {
      this.renderComponent({
        afterClose: this.removeContainer,
        visible: false,
        on: {
          close: function close() {}
        }
      });
    } else {
      this.removeContainer();
    }
  },

  methods: {
    getComponent: function getComponent() {
      var extra = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var h = this.$createElement;
      var $attrs = this.$attrs,
          $listeners = this.$listeners,
          $props = this.$props,
          $slots = this.$slots;

      var on = extra.on,
          otherProps = _objectWithoutProperties(extra, ['on']);

      var dialogProps = {
        props: _extends({}, $props, {
          dialogClass: getClass(this),
          dialogStyle: getStyle(this)
        }, otherProps),
        attrs: $attrs,
        ref: '_component',
        key: 'dialog',
        on: _extends({}, $listeners, on)
      };
      return h(
        Dialog,
        dialogProps,
        [$slots['default']]
      );
    },
    getContainer2: function getContainer2() {
      if (this.getContainer) {
        return this.getContainer();
      }
      var container = document.createElement('div');
      document.body.appendChild(container);
      return container;
    }
  },

  render: function render() {
    var _this = this;

    var h = arguments[0];
    var visible = this.visible;

    return h(ContainerRender, {
      attrs: {
        parent: this,
        visible: visible,
        autoDestroy: false,
        getComponent: this.getComponent,
        getContainer: this.getContainer2,
        children: function children(_ref) {
          var renderComponent = _ref.renderComponent,
              removeContainer = _ref.removeContainer;

          _this.renderComponent = renderComponent;
          _this.removeContainer = removeContainer;
          return null;
        }
      }
    });
  }
};

export default DialogWrap;