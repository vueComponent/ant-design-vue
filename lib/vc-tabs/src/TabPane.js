'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

exports['default'] = {
  name: 'TabPane',
  props: {
    tab: [String, Number, Function, Array, Object],
    disabled: Boolean,
    closable: Boolean,
    forceRender: Boolean
  },
  data: function data() {
    return {};
  },

  computed: {
    classes: function classes() {
      var _ref;

      var $parent = this.$parent,
          active = this.active;

      var prefixCls = $parent.prefixCls + '-tabpane';
      return _ref = {}, (0, _defineProperty3['default'])(_ref, '' + prefixCls, true), (0, _defineProperty3['default'])(_ref, prefixCls + '-inactive', !active), (0, _defineProperty3['default'])(_ref, prefixCls + '-active', active), _ref;
    },
    active: function active() {
      var activeKey = this.$parent.activeKey;

      return activeKey === this.$vnode.key;
    },
    isRender: function isRender() {
      var active = this.active,
          $parent = this.$parent;

      var destroyInactiveTabPane = $parent.destroyInactiveTabPane;
      this._isActived = this._isActived || active;
      return destroyInactiveTabPane ? active : this._isActived;
    }
  },
  methods: {},
  render: function render() {
    var h = arguments[0];
    var active = this.active,
        classes = this.classes,
        $slots = this.$slots,
        isRender = this.isRender,
        forceRender = this.forceRender;

    return h(
      'div',
      {
        attrs: {
          role: 'tabpanel',
          'aria-hidden': active ? 'false' : 'true'
        },
        'class': classes
      },
      [isRender || forceRender ? $slots['default'] : null]
    );
  }
};
module.exports = exports['default'];