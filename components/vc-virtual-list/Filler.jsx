import classNames from '../_util/classNames';

const Filter = ({ height, offset, prefixCls }, { slots }) => {
  let outerStyle = {};

  let innerStyle = {
    display: 'flex',
    flexDirection: 'column',
  };

  if (offset !== undefined) {
    outerStyle = { height, position: 'relative', overflow: 'hidden' };

    innerStyle = {
      ...innerStyle,
      transform: `translateY(${offset}px)`,
      position: 'absolute',
      left: 0,
      right: 0,
      top: 0,
    };
  }

  return (
    <div style={outerStyle}>
      <div
        style={innerStyle}
        class={classNames({
          [`${prefixCls}-holder-inner`]: prefixCls,
        })}
      >
        {slots.default?.()}
      </div>
    </div>
  );
};

export default Filter;
