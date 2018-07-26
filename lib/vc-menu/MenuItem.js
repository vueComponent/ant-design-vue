'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.menuItemProps = undefined;

var _babelHelperVueJsxMergeProps = require('babel-helper-vue-jsx-merge-props');

var _babelHelperVueJsxMergeProps2 = _interopRequireDefault(_babelHelperVueJsxMergeProps);

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _vueTypes = require('../_util/vue-types');

var _vueTypes2 = _interopRequireDefault(_vueTypes);

var _KeyCode = require('../_util/KeyCode');

var _KeyCode2 = _interopRequireDefault(_KeyCode);

var _BaseMixin = require('../_util/BaseMixin');

var _BaseMixin2 = _interopRequireDefault(_BaseMixin);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var props = {
  rootPrefixCls: _vueTypes2['default'].string,
  eventKey: _vueTypes2['default'].oneOfType([_vueTypes2['default'].string, _vueTypes2['default'].number]),
  active: _vueTypes2['default'].bool,
  selectedKeys: _vueTypes2['default'].array,
  disabled: _vueTypes2['default'].bool,
  title: _vueTypes2['default'].string,
  index: _vueTypes2['default'].number,
  inlineIndent: _vueTypes2['default'].number.def(24),
  level: _vueTypes2['default'].number.def(1),
  mode: _vueTypes2['default'].oneOf(['horizontal', 'vertical', 'vertical-left', 'vertical-right', 'inline']).def('vertical'),
  parentMenu: _vueTypes2['default'].object,
  multiple: _vueTypes2['default'].bool,
  value: _vueTypes2['default'].any
  // clearSubMenuTimers: PropTypes.func.def(noop),
};
// import { noop } from './util'

var MenuItem = {
  name: 'MenuItem',
  props: props,
  inject: {
    parentMenuContext: { 'default': undefined }
  },
  mixins: [_BaseMixin2['default']],
  isMenuItem: true,
  beforeDestroy: function beforeDestroy() {
    var props = this.$props;
    this.__emit('destroy', props.eventKey);
  },

  methods: {
    onKeyDown: function onKeyDown(e) {
      var keyCode = e.keyCode;
      if (keyCode === _KeyCode2['default'].ENTER) {
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
    var className = (_className = {}, (0, _defineProperty3['default'])(_className, this.getPrefixCls(), true), (0, _defineProperty3['default'])(_className, this.getActiveClassName(), !props.disabled && props.active), (0, _defineProperty3['default'])(_className, this.getSelectedClassName(), selected), (0, _defineProperty3['default'])(_className, this.getDisabledClassName(), props.disabled), _className);
    var attrs = (0, _extends3['default'])({}, props.attribute, {
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
      on: (0, _extends3['default'])({}, mouseEvent)
    };
    return h(
      'li',
      (0, _babelHelperVueJsxMergeProps2['default'])([liProps, {
        style: style,
        'class': className
      }]),
      [this.$slots['default']]
    );
  }
};

exports['default'] = MenuItem;
exports.menuItemProps = props;