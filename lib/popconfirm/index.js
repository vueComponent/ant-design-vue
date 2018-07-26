'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _omit = require('omit.js');

var _omit2 = _interopRequireDefault(_omit);

var _tooltip = require('../tooltip');

var _tooltip2 = _interopRequireDefault(_tooltip);

var _abstractTooltipProps = require('../tooltip/abstractTooltipProps');

var _abstractTooltipProps2 = _interopRequireDefault(_abstractTooltipProps);

var _vueTypes = require('../_util/vue-types');

var _vueTypes2 = _interopRequireDefault(_vueTypes);

var _propsUtil = require('../_util/props-util');

var _BaseMixin = require('../_util/BaseMixin');

var _BaseMixin2 = _interopRequireDefault(_BaseMixin);

var _buttonTypes = require('../button/buttonTypes');

var _buttonTypes2 = _interopRequireDefault(_buttonTypes);

var _icon = require('../icon');

var _icon2 = _interopRequireDefault(_icon);

var _button = require('../button');

var _button2 = _interopRequireDefault(_button);

var _LocaleReceiver = require('../locale-provider/LocaleReceiver');

var _LocaleReceiver2 = _interopRequireDefault(_LocaleReceiver);

var _default = require('../locale-provider/default');

var _default2 = _interopRequireDefault(_default);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var tooltipProps = (0, _abstractTooltipProps2['default'])();
var btnProps = (0, _buttonTypes2['default'])();
exports['default'] = {
  name: 'APopconfirm',
  props: (0, _extends3['default'])({}, tooltipProps, {
    prefixCls: _vueTypes2['default'].string.def('ant-popover'),
    transitionName: _vueTypes2['default'].string.def('zoom-big'),
    content: _vueTypes2['default'].any,
    title: _vueTypes2['default'].any,
    trigger: tooltipProps.trigger.def('click'),
    okType: btnProps.type.def('primary'),
    okText: _vueTypes2['default'].any,
    cancelText: _vueTypes2['default'].any
  }),
  mixins: [_BaseMixin2['default']],
  model: {
    prop: 'visible',
    event: 'visibleChange'
  },
  watch: {
    visible: function visible(val) {
      this.sVisible = val;
    }
  },
  data: function data() {
    return {
      sVisible: this.$props.visible
    };
  },

  methods: {
    onConfirm: function onConfirm(e) {
      this.setVisible(false);
      this.$emit('confirm', e);
    },
    onCancel: function onCancel(e) {
      this.setVisible(false);
      this.$emit('cancel', e);
    },
    onVisibleChange: function onVisibleChange(sVisible) {
      this.setVisible(sVisible);
    },
    setVisible: function setVisible(sVisible) {
      if (!(0, _propsUtil.hasProp)(this, 'visible')) {
        this.setState({ sVisible: sVisible });
      }
      this.$emit('visibleChange', sVisible);
    },
    getPopupDomNode: function getPopupDomNode() {
      return this.$refs.tooltip.getPopupDomNode();
    },
    renderOverlay: function renderOverlay(popconfirmLocale) {
      var h = this.$createElement;
      var prefixCls = this.prefixCls,
          okType = this.okType;

      return h(
        'div',
        { 'class': prefixCls + '-inner-content' },
        [h(
          'div',
          { 'class': prefixCls + '-message' },
          [h(_icon2['default'], {
            attrs: { type: 'exclamation-circle' }
          }), h(
            'div',
            { 'class': prefixCls + '-message-title' },
            [(0, _propsUtil.getComponentFromProp)(this, 'title')]
          )]
        ), h(
          'div',
          { 'class': prefixCls + '-buttons' },
          [h(
            _button2['default'],
            {
              on: {
                'click': this.onCancel
              },
              attrs: { size: 'small' }
            },
            [(0, _propsUtil.getComponentFromProp)(this, 'cancelText') || popconfirmLocale.cancelText]
          ), h(
            _button2['default'],
            {
              on: {
                'click': this.onConfirm
              },
              attrs: { type: okType, size: 'small' }
            },
            [(0, _propsUtil.getComponentFromProp)(this, 'okText') || popconfirmLocale.okText]
          )]
        )]
      );
    }
  },
  render: function render(h) {
    var props = (0, _propsUtil.getOptionProps)(this);
    var otherProps = (0, _omit2['default'])(props, ['title', 'content', 'cancelText', 'okText']);
    var tooltipProps = {
      props: (0, _extends3['default'])({}, otherProps, {
        visible: this.sVisible
      }),
      ref: 'tooltip',
      on: {
        visibleChange: this.onVisibleChange
      }
    };
    var overlay = h(_LocaleReceiver2['default'], {
      attrs: {
        componentName: 'Popconfirm',
        defaultLocale: _default2['default'].Popconfirm
      },
      scopedSlots: { 'default': this.renderOverlay }
    });
    return h(
      _tooltip2['default'],
      tooltipProps,
      [h(
        'template',
        { slot: 'title' },
        [overlay]
      ), this.$slots['default']]
    );
  }
};
module.exports = exports['default'];