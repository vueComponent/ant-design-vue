import _mergeJSXProps from 'babel-helper-vue-jsx-merge-props';
import _defineProperty from 'babel-runtime/helpers/defineProperty';

import PropTypes from '../_util/vue-types';
import { getOptionProps, getComponentFromProp } from '../_util/props-util';

function isString(str) {
  return typeof str === 'string';
}

export default {
  name: 'Step',
  props: {
    prefixCls: PropTypes.string,
    wrapperStyle: PropTypes.object,
    itemWidth: PropTypes.string,
    status: PropTypes.string,
    iconPrefix: PropTypes.string,
    icon: PropTypes.node,
    adjustMarginRight: PropTypes.string,
    stepNumber: PropTypes.string,
    description: PropTypes.any,
    title: PropTypes.any,
    progressDot: PropTypes.oneOfType([PropTypes.bool, PropTypes.func]),
    tailContent: PropTypes.any
  },
  methods: {
    renderIconNode: function renderIconNode() {
      var _iconClassName;

      var h = this.$createElement;

      var _getOptionProps = getOptionProps(this),
          prefixCls = _getOptionProps.prefixCls,
          stepNumber = _getOptionProps.stepNumber,
          status = _getOptionProps.status,
          iconPrefix = _getOptionProps.iconPrefix;

      var progressDot = this.progressDot;
      if (progressDot === undefined) {
        progressDot = this.$scopedSlots.progressDot;
      }
      var icon = getComponentFromProp(this, 'icon');
      var title = getComponentFromProp(this, 'title');
      var description = getComponentFromProp(this, 'description');
      var iconNode = void 0;
      var iconClassName = (_iconClassName = {}, _defineProperty(_iconClassName, prefixCls + '-icon', true), _defineProperty(_iconClassName, iconPrefix + 'icon', true), _defineProperty(_iconClassName, iconPrefix + 'icon-' + icon, icon && isString(icon)), _defineProperty(_iconClassName, iconPrefix + 'icon-check', !icon && status === 'finish'), _defineProperty(_iconClassName, iconPrefix + 'icon-cross', !icon && status === 'error'), _iconClassName);
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

    var _getOptionProps2 = getOptionProps(this),
        prefixCls = _getOptionProps2.prefixCls,
        itemWidth = _getOptionProps2.itemWidth,
        _getOptionProps2$stat = _getOptionProps2.status,
        status = _getOptionProps2$stat === undefined ? 'wait' : _getOptionProps2$stat,
        icon = _getOptionProps2.icon,
        tailContent = _getOptionProps2.tailContent,
        adjustMarginRight = _getOptionProps2.adjustMarginRight;

    var title = getComponentFromProp(this, 'title');
    var description = getComponentFromProp(this, 'description');

    var classString = (_classString = {}, _defineProperty(_classString, prefixCls + '-item', true), _defineProperty(_classString, prefixCls + '-item-' + status, true), _defineProperty(_classString, prefixCls + '-item-custom', icon), _classString);
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
      _mergeJSXProps([stepProps, {
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