import _mergeJSXProps from 'babel-helper-vue-jsx-merge-props';
import _objectWithoutProperties from 'babel-runtime/helpers/objectWithoutProperties';
import _extends from 'babel-runtime/helpers/extends';

import Button from '../button';
import { ButtonGroupProps } from '../button/button-group';
import Icon from '../icon';
import Dropdown from './dropdown';
import PropTypes from '../_util/vue-types';
import { hasProp, getComponentFromProp } from '../_util/props-util';
import getDropdownProps from './getDropdownProps';
var DropdownProps = getDropdownProps();
var ButtonGroup = Button.Group;
var DropdownButtonProps = _extends({}, ButtonGroupProps, DropdownProps, {
  type: PropTypes.oneOf(['primary', 'ghost', 'dashed', 'default']).def('default'),
  disabled: PropTypes.bool,
  prefixCls: PropTypes.string.def('ant-dropdown-button'),
  placement: DropdownProps.placement.def('bottomRight')
});
export { DropdownButtonProps };
export default {
  name: 'ADropdownButton',
  props: DropdownButtonProps,
  methods: {
    onClick: function onClick(e) {
      this.$emit('click', e);
    },
    onVisibleChange: function onVisibleChange(val) {
      this.$emit('visibleChange', val);
    }
  },
  model: {
    prop: 'visible',
    event: 'visibleChange'
  },
  render: function render() {
    var h = arguments[0];

    var _$props = this.$props,
        type = _$props.type,
        disabled = _$props.disabled,
        prefixCls = _$props.prefixCls,
        trigger = _$props.trigger,
        align = _$props.align,
        visible = _$props.visible,
        placement = _$props.placement,
        getPopupContainer = _$props.getPopupContainer,
        restProps = _objectWithoutProperties(_$props, ['type', 'disabled', 'prefixCls', 'trigger', 'align', 'visible', 'placement', 'getPopupContainer']);

    var dropdownProps = {
      props: {
        align: align,
        disabled: disabled,
        trigger: disabled ? [] : trigger,
        placement: placement,
        getPopupContainer: getPopupContainer
      },
      on: {
        visibleChange: this.onVisibleChange
      }
    };
    if (hasProp(this, 'visible')) {
      dropdownProps.props.visible = visible;
    }

    return h(
      ButtonGroup,
      _mergeJSXProps([restProps, {
        'class': prefixCls
      }]),
      [h(
        Button,
        {
          attrs: {
            type: type,
            disabled: disabled
          },
          on: {
            'click': this.onClick
          }
        },
        [this.$slots['default']]
      ), h(
        Dropdown,
        dropdownProps,
        [h(
          'template',
          { slot: 'overlay' },
          [getComponentFromProp(this, 'overlay')]
        ), h(
          Button,
          {
            attrs: { type: type }
          },
          [h(Icon, {
            attrs: { type: 'down' }
          })]
        )]
      )]
    );
  }
};