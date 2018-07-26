import _mergeJSXProps from 'babel-helper-vue-jsx-merge-props';
import _extends from 'babel-runtime/helpers/extends';
import _defineProperty from 'babel-runtime/helpers/defineProperty';

import PropTypes from '../_util/vue-types';
import KeyCode from '../_util/KeyCode';
// import { noop } from './util'
import BaseMixin from '../_util/BaseMixin';
var props = {
  rootPrefixCls: PropTypes.string,
  eventKey: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  active: PropTypes.bool,
  selectedKeys: PropTypes.array,
  disabled: PropTypes.bool,
  title: PropTypes.string,
  index: PropTypes.number,
  inlineIndent: PropTypes.number.def(24),
  level: PropTypes.number.def(1),
  mode: PropTypes.oneOf(['horizontal', 'vertical', 'vertical-left', 'vertical-right', 'inline']).def('vertical'),
  parentMenu: PropTypes.object,
  multiple: PropTypes.bool,
  value: PropTypes.any
  // clearSubMenuTimers: PropTypes.func.def(noop),
};
var MenuItem = {
  name: 'MenuItem',
  props: props,
  inject: {
    parentMenuContext: { 'default': undefined }
  },
  mixins: [BaseMixin],
  isMenuItem: true,
  beforeDestroy: function beforeDestroy() {
    var props = this.$props;
    this.__emit('destroy', props.eventKey);
  },

  methods: {
    onKeyDown: function onKeyDown(e) {
      var keyCode = e.keyCode;
      if (keyCode === KeyCode.ENTER) {
        this.onClick(e);
        return true;
      }
    },
    onMouseLeave: function onMouseLeave(e) {
      var eventKey = this.$props.eventKey;

      this.__emit('itemHover', {
        key: eventKey,
        hover: false
      });
      this.__emit('mouseleave', {
        key: eventKey,
        domEvent: e
      });
    },
    onMouseEnter: function onMouseEnter(e) {
      var eventKey = this.eventKey;
      // if (parentMenuContext && parentMenuContext.subMenuInstance) {
      //   parentMenuContext.subMenuInstance.clearSubMenuTimers()
      // }

      this.__emit('itemHover', {
        key: eventKey,
        hover: true
      });
      this.__emit('mouseenter', {
        key: eventKey,
        domEvent: e
      });
    },
    onClick: function onClick(e) {
      var _$props = this.$props,
          eventKey = _$props.eventKey,
          multiple = _$props.multiple;

      var selected = this.isSelected();
      var info = {
        key: eventKey,
        keyPath: [eventKey],
        item: this,
        domEvent: e
      };

      this.__emit('click', info);
      if (multiple) {
        if (selected) {
          this.__emit('deselect', info);
        } else {
          this.__emit('select', info);
        }
      } else if (!selected) {
        this.__emit('select', info);
      }
    },
    getPrefixCls: function getPrefixCls() {
      return this.$props.rootPrefixCls + '-item';
    },
    getActiveClassName: function getActiveClassName() {
      return this.getPrefixCls() + '-active';
    },
    getSelectedClassName: function getSelectedClassName() {
      return this.getPrefixCls() + '-selected';
    },
    getDisabledClassName: function getDisabledClassName() {
      return this.getPrefixCls() + '-disabled';
    },
    isSelected: function isSelected() {
      return this.$props.selectedKeys && this.$props.selectedKeys.indexOf(this.$props.eventKey) !== -1;
    }
  },

  render: function render() {
    var _className;

    var h = arguments[0];

    var props = this.$props;
    var selected = this.isSelected();
    var className = (_className = {}, _defineProperty(_className, this.getPrefixCls(), true), _defineProperty(_className, this.getActiveClassName(), !props.disabled && props.active), _defineProperty(_className, this.getSelectedClassName(), selected), _defineProperty(_className, this.getDisabledClassName(), props.disabled), _className);
    var attrs = _extends({}, props.attribute, {
      title: props.title,
      role: 'menuitem',
      'aria-selected': selected,
      'aria-disabled': props.disabled
    });
    var mouseEvent = {};

    if (!props.disabled) {
      mouseEvent = {
        click: this.onClick,
        mouseleave: this.onMouseLeave,
        mouseenter: this.onMouseEnter
      };
    }

    var style = {};
    if (props.mode === 'inline') {
      style.paddingLeft = props.inlineIndent * props.level + 'px';
    }
    var liProps = {
      attrs: attrs,
      on: _extends({}, mouseEvent)
    };
    return h(
      'li',
      _mergeJSXProps([liProps, {
        style: style,
        'class': className
      }]),
      [this.$slots['default']]
    );
  }
};

export default MenuItem;
export { props as menuItemProps };