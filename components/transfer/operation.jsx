import PropTypes from '../_util/vue-types';
import { getOptionProps } from '../_util/props-util';
import Button from '../button';

function noop() {}

export const TransferOperationProps = {
  className: PropTypes.string,
  leftArrowText: PropTypes.string,
  rightArrowText: PropTypes.string,
  moveToLeft: PropTypes.any,
  moveToRight: PropTypes.any,
  leftActive: PropTypes.bool,
  rightActive: PropTypes.bool,
  disabled: PropTypes.bool,
};

export default {
  name: 'Operation',
  props: { ...TransferOperationProps },
  render() {
    const {
      disabled,
      moveToLeft = noop,
      moveToRight = noop,
      leftArrowText = '',
      rightArrowText = '',
      leftActive,
      rightActive,
    } = getOptionProps(this);
    return (
      <div>
        <Button
          type="primary"
          size="small"
          disabled={disabled || !rightActive}
          onClick={moveToRight}
          icon="right"
        >
          {rightArrowText}
        </Button>
        <Button
          type="primary"
          size="small"
          disabled={disabled || !leftActive}
          onClick={moveToLeft}
          icon="left"
        >
          {leftArrowText}
        </Button>
      </div>
    );
  },
};
