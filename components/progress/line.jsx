import { validProgress } from './utils';

const Line = {
  functional: true,
  render(h, context) {
    const { props, children } = context;
    const {
      prefixCls,
      percent,
      successPercent,
      strokeWidth,
      size,
      strokeColor,
      strokeLinecap,
    } = props;
    const percentStyle = {
      width: `${validProgress(percent)}%`,
      height: `${strokeWidth || (size === 'small' ? 6 : 8)}px`,
      background: strokeColor,
      borderRadius: strokeLinecap === 'square' ? 0 : '100px',
    };
    const successPercentStyle = {
      width: `${validProgress(successPercent)}%`,
      height: `${strokeWidth || (size === 'small' ? 6 : 8)}px`,
      borderRadius: strokeLinecap === 'square' ? 0 : '100px',
    };
    const successSegment =
      successPercent !== undefined ? (
        <div class={`${prefixCls}-success-bg`} style={successPercentStyle} />
      ) : null;
    return (
      <div>
        <div class={`${prefixCls}-outer`}>
          <div class={`${prefixCls}-inner`}>
            <div class={`${prefixCls}-bg`} style={percentStyle} />
            {successSegment}
          </div>
        </div>
        {children}
      </div>
    );
  },
};

export default Line;
