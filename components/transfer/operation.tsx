import type { CSSProperties, FunctionalComponent } from 'vue';
import LeftOutlined from '@ant-design/icons-vue/LeftOutlined';
import RightOutlined from '@ant-design/icons-vue/RightOutlined';
import Button from '../button';

function noop() {}

export interface TransferOperationProps {
  class?: any;
  leftArrowText?: string;
  rightArrowText?: string;
  moveToLeft?: (e: MouseEvent) => void;
  moveToRight?: (e: MouseEvent) => void;
  leftActive?: boolean;
  rightActive?: boolean;
  style?: CSSProperties | string;
  disabled?: boolean;
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
  } = props;

  return (
    <div class={className} style={style}>
      <Button
        type="primary"
        size="small"
        disabled={disabled || !rightActive}
        onClick={moveToRight}
        icon={<RightOutlined />}
      >
        {rightArrowText}
      </Button>
      <Button
        type="primary"
        size="small"
        disabled={disabled || !leftActive}
        onClick={moveToLeft}
        icon={<LeftOutlined />}
      >
        {leftArrowText}
      </Button>
    </div>
  );
};

Operation.inheritAttrs = false;

export default Operation;
