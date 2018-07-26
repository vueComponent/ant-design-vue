'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _babelHelperVueJsxMergeProps = require('babel-helper-vue-jsx-merge-props');

var _babelHelperVueJsxMergeProps2 = _interopRequireDefault(_babelHelperVueJsxMergeProps);

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _vueTypes = require('../_util/vue-types');

var _vueTypes2 = _interopRequireDefault(_vueTypes);

var _propsUtil = require('../_util/props-util');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function isString(str) {
  return typeof str === 'string';
}

exports['default'] = {
  name: 'Step',
  props: {
    prefixCls: _vueTypes2['default'].string,
    wrapperStyle: _vueTypes2['default'].object,
    itemWidth: _vueTypes2['default'].string,
    status: _vueTypes2['default'].string,
    iconPrefix: _vueTypes2['default'].string,
    icon: _vueTypes2['default'].node,
    adjustMarginRight: _vueTypes2['default'].string,
    stepNumber: _vueTypes2['default'].string,
    description: _vueTypes2['default'].any,
    title: _vueTypes2['default'].any,
    progressDot: _vueTypes2['default'].oneOfType([_vueTypes2['default'].bool, _vueTypes2['default'].func]),
    tailContent: _vueTypes2['default'].any
  },
  methods: {
    renderIconNode: function renderIconNode() {
      var _iconClassName;

      var h = this.$createElement;

      var _getOptionProps = (0, _propsUtil.getOptionProps)(this),
          prefixCls = _getOptionProps.prefixCls,
          stepNumber = _getOptionProps.stepNumber,
          status = _getOptionProps.status,
          iconPrefix = _getOptionProps.iconPrefix;

      var progressDot = this.progressDot;
      if (progressDot === undefined) {
        progressDot = this.$scopedSlots.progressDot;
      }
      var icon = (0, _propsUtil.getComponentFromProp)(this, 'icon');
      var title = (0, _propsUtil.getComponentFromProp)(this, 'title');
      var description = (0, _propsUtil.getComponentFromProp)(this, 'description');
      var iconNode = void 0;
      var iconClassName = (_iconClassName = {}, (0, _defineProperty3['default'])(_iconClassName, prefixCls + '-icon', true), (0, _defineProperty3['default'])(_iconClassName, iconPrefix + 'icon', true), (0, _defineProperty3['default'])(_iconClassName, iconPrefix + 'icon-' + icon, icon && isString(icon)), (0, _defineProperty3['default'])(_iconClassName, iconPrefix + 'icon-check', !icon && status === 'finish'), (0, _defineProperty3['default'])(_iconClassName, iconPrefix + 'icon-cross', !icon && status === 'error'), _iconClassName);
      var iconDot = h('span', { 'class': prefixCls + '-icon-dot' });
      // `progressDot` enjoy the highest priority
      if (progressDot) {
        if (typeof progressDot === 'function') {
          iconNode = h(
            'span',
            { 'class': prefixCls + '-icon' },
            [progressDot({ index: stepNumber - 1, status: status, title: title, description: description, prefixCls: prefixCls })]
          );
        } else {
          iconNode = h(
            'span',
            { 'class': prefixCls + '-icon' },
            [iconDot]
          );
        }
      } else if (icon && !isString(icon)) {
        iconNode = h(
          'span',
          { 'class': prefixCls + '-icon' },
          [icon]
        );
      } else if (icon || status === 'finish' || status === 'error') {
        iconNode = h('span', { 'class': iconClassName });
      } else {
        iconNode = h(
          'span',
          { 'class': prefixCls + '-icon' },
          [stepNumber]
        );
      }
      return iconNode;
    }
  },
  render: function render() {
    var _classString;

    var h = arguments[0];

    var _getOptionProps2 = (0, _propsUtil.getOptionProps)(this),
        prefixCls = _getOptionProps2.prefixCls,
        itemWidth = _getOptionProps2.itemWidth,
        _getOptionProps2$stat = _getOptionProps2.status,
        status = _getOptionProps2$stat === undefined ? 'wait' : _getOptionProps2$stat,
        icon = _getOptionProps2.icon,
        tailContent = _getOptionProps2.tailContent,
        adjustMarginRight = _getOptionProps2.adjustMarginRight;

    var title = (0, _propsUtil.getComponentFromProp)(this, 'title');
    var description = (0, _propsUtil.getComponentFromProp)(this, 'description');

    var classString = (_classString = {}, (0, _defineProperty3['default'])(_classString, prefixCls + '-item', true), (0, _defineProperty3['default'])(_classString, prefixCls + '-item-' + status, true), (0, _defineProperty3['default'])(_classString, prefixCls + '-item-custom', icon), _classString);
    var stepProps = {
      'class': classString,
      on: this.$listeners
    };
    var stepItemStyle = {};
    if (itemWidth) {
      stepItemStyle.width = itemWidth;
    }
    if (adjustMarginRight) {
      stepItemStyle.marginRight = adjustMarginRight;
    }
    return h(
      'div',
      (0, _babelHelperVueJsxMergeProps2['default'])([stepProps, {
        style: stepItemStyle
      }]),
      [h(
        'div',
        { 'class': prefixCls + '-item-tail' },
        [tailContent]
      ), h(
        'div',
        { 'class': prefixCls + '-item-icon' },
        [this.renderIconNode()]
      ), h(
        'div',
        { 'class': prefixCls + '-item-content' },
        [h(
          'div',
          { 'class': prefixCls + '-item-title' },
          [title]
        ), description && h(
          'div',
          { 'class': prefixCls + '-item-description' },
          [description]
        )]
      )]
    );
  }
};
module.exports = exports['default'];