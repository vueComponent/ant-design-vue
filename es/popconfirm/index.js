import _extends from 'babel-runtime/helpers/extends';

import omit from 'omit.js';
import Tooltip from '../tooltip';
import abstractTooltipProps from '../tooltip/abstractTooltipProps';
import PropTypes from '../_util/vue-types';
import { getOptionProps, hasProp, getComponentFromProp } from '../_util/props-util';
import BaseMixin from '../_util/BaseMixin';
import buttonTypes from '../button/buttonTypes';
import Icon from '../icon';
import Button from '../button';
import LocaleReceiver from '../locale-provider/LocaleReceiver';
import defaultLocale from '../locale-provider/default';

var tooltipProps = abstractTooltipProps();
var btnProps = buttonTypes();
export default {
  name: 'APopconfirm',
  props: _extends({}, tooltipProps, {
    prefixCls: PropTypes.string.def('ant-popover'),
    transitionName: PropTypes.string.def('zoom-big'),
    content: PropTypes.any,
    title: PropTypes.any,
    trigger: tooltipProps.trigger.def('click'),
    okType: btnProps.type.def('primary'),
    okText: PropTypes.any,
    cancelText: PropTypes.any
  }),
  mixins: [BaseMixin],
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
      if (!hasProp(this, 'visible')) {
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
          [h(Icon, {
            attrs: { type: 'exclamation-circle' }
          }), h(
            'div',
            { 'class': prefixCls + '-message-title' },
            [getComponentFromProp(this, 'title')]
          )]
        ), h(
          'div',
          { 'class': prefixCls + '-buttons' },
          [h(
            Button,
            {
              on: {
                'click': this.onCancel
              },
              attrs: { size: 'small' }
            },
            [getComponentFromProp(this, 'cancelText') || popconfirmLocale.cancelText]
          ), h(
            Button,
            {
              on: {
                'click': this.onConfirm
              },
              attrs: { type: okType, size: 'small' }
            },
            [getComponentFromProp(this, 'okText') || popconfirmLocale.okText]
          )]
        )]
      );
    }
  },
  render: function render(h) {
    var props = getOptionProps(this);
    var otherProps = omit(props, ['title', 'content', 'cancelText', 'okText']);
    var tooltipProps = {
      props: _extends({}, otherProps, {
        visible: this.sVisible
      }),
      ref: 'tooltip',
      on: {
        visibleChange: this.onVisibleChange
      }
    };
    var overlay = h(LocaleReceiver, {
      attrs: {
        componentName: 'Popconfirm',
        defaultLocale: defaultLocale.Popconfirm
      },
      scopedSlots: { 'default': this.renderOverlay }
    });
    return h(
      Tooltip,
      tooltipProps,
      [h(
        'template',
        { slot: 'title' },
        [overlay]
      ), this.$slots['default']]
    );
  }
};