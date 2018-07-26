import _extends from 'babel-runtime/helpers/extends';
import PropTypes from '../_util/vue-types';
import { getOptionProps } from '../_util/props-util';
import Button from '../button';

function noop() {}

export var TransferOperationProps = {
  className: PropTypes.string,
  leftArrowText: PropTypes.string,
  rightArrowText: PropTypes.string,
  moveToLeft: PropTypes.any,
  moveToRight: PropTypes.any,
  leftActive: PropTypes.bool,
  rightActive: PropTypes.bool
};

export default {
  name: 'Operation',
  props: _extends({}, TransferOperationProps),
  render: function render() {
    var h = arguments[0];

    var _getOptionProps = getOptionProps(this),
        _getOptionProps$moveT = _getOptionProps.moveToLeft,
        moveToLeft = _getOptionProps$moveT === undefined ? noop : _getOptionProps$moveT,
        _getOptionProps$moveT2 = _getOptionProps.moveToRight,
        moveToRight = _getOptionProps$moveT2 === undefined ? noop : _getOptionProps$moveT2,
        _getOptionProps$leftA = _getOptionProps.leftArrowText,
        leftArrowText = _getOptionProps$leftA === undefined ? '' : _getOptionProps$leftA,
        _getOptionProps$right = _getOptionProps.rightArrowText,
        rightArrowText = _getOptionProps$right === undefined ? '' : _getOptionProps$right,
        leftActive = _getOptionProps.leftActive,
        rightActive = _getOptionProps.rightActive;

    return h('div', [h(
      Button,
      {
        attrs: {
          type: 'primary',
          size: 'small',
          disabled: !leftActive,

          icon: 'left'
        },
        on: {
          'click': moveToLeft
        }
      },
      [leftArrowText]
    ), h(
      Button,
      {
        attrs: {
          type: 'primary',
          size: 'small',
          disabled: !rightActive,

          icon: 'right'
        },
        on: {
          'click': moveToRight
        }
      },
      [rightArrowText]
    )]);
  }
};