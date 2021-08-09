import type { CSSProperties, FunctionalComponent } from 'vue';
import LeftOutlined from '@ant-design/icons-vue/LeftOutlined';
import RightOutlined from '@ant-design/icons-vue/RightOutlined';
import Button from '../button';
import type { Direction } from '../config-provider';

function noop() {}

export interface TransferOperationProps {
  class?: string;
  leftArrowText?: string;
  rightArrowText?: string;
  moveToLeft?: (e: MouseEvent) => void;
  moveToRight?: (e: MouseEvent) => void;
  leftActive?: boolean;
  rightActive?: boolean;
  style?: CSSProperties | string;
  disabled?: boolean;
  direction?: Direction;
  oneWay?: boolean;
}

const Operation: FunctionalComponent<TransferOperationProps> = props => {
  const {
    disabled,
    moveToLeft = noop,
    moveToRight = noop,
    leftArrowText = '',
    rightArrowText = '',
    leftActive,
    rightActive,
    class: className,
    style,
    direction,
    oneWay,
  } = props;

  return (
    <div class={className} style={style}>
      <Button
        type="primary"
        size="small"
        disabled={disabled || !rightActive}
        onClick={moveToRight}
        icon={direction !== 'rtl' ? <RightOutlined /> : <LeftOutlined />}
      >
        {rightArrowText}
      </Button>
      {!oneWay && (
        <Button
          type="primary"
          size="small"
          disabled={disabled || !leftActive}
          onClick={moveToLeft}
          icon={direction !== 'rtl' ? <LeftOutlined /> : <RightOutlined />}
        >
          {leftArrowText}
        </Button>
      )}
    </div>
  );
};
Operation.displayName = 'Operation';
Operation.inheritAttrs = false;

export default Operation;
