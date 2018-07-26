'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _MenuMixin = require('./MenuMixin');

var _MenuMixin2 = _interopRequireDefault(_MenuMixin);

var _BaseMixin = require('../_util/BaseMixin');

var _BaseMixin2 = _interopRequireDefault(_BaseMixin);

var _commonPropsType = require('./commonPropsType');

var _commonPropsType2 = _interopRequireDefault(_commonPropsType);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

exports['default'] = {
  name: 'SubPopupMenu',
  props: (0, _extends3['default'])({}, _commonPropsType2['default']),

  mixins: [_MenuMixin2['default'], _BaseMixin2['default']],
  methods: {
    onDeselect: function onDeselect(selectInfo) {
      this.__emit('deselect', selectInfo);
    },
    onSelect: function onSelect(selectInfo) {
      this.__emit('select', selectInfo);
    },
    onClick: function onClick(e) {
      this.__emit('click', e);
    },
    onOpenChange: function onOpenChange(e) {
      this.__emit('openChange', e);
    },
    onDestroy: function onDestroy(key) {
      this.__emit('destroy', key);
    },
    getOpenTransitionName: function getOpenTransitionName() {
      return this.$props.openTransitionName;
    },
    renderMenuItem: function renderMenuItem(c, i, subIndex) {
      if (!c) {
        return null;
      }
      var props = this.$props;
      var extraProps = {
        openKeys: props.openKeys,
        selectedKeys: props.selectedKeys,
        triggerSubMenuAction: props.triggerSubMenuAction,
        isRootMenu: false
      };
      return this.renderCommonMenuItem(c, i, subIndex, extraProps);
    }
  },
  render: function render() {
    var props = this.$props;

    this.haveOpened = this.haveOpened || props.visible || props.forceSubMenuRender;
    if (!this.haveOpened) {
      return null;
    }
    var prefixCls = this.$props.prefixCls;

    return this.renderRoot((0, _extends3['default'])({}, this.$props, { 'class': prefixCls + '-sub' }), this.$slots['default']);
  }
};
module.exports = exports['default'];