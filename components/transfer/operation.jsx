import LeftOutlined from '@ant-design/icons-vue/LeftOutlined';
import RightOutlined from '@ant-design/icons-vue/RightOutlined';
import Button from '../button';

function noop() {}

const Operation = (_, { attrs }) => {
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
  } = attrs;

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
