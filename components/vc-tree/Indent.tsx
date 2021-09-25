interface IndentProps {
  prefixCls: string;
  level: number;
  isStart: boolean[];
  isEnd: boolean[];
}

const Indent = ({ prefixCls, level, isStart, isEnd }: IndentProps) => {
  const baseClassName = `${prefixCls}-indent-unit`;
  const list = [];
  for (let i = 0; i < level; i += 1) {
    list.push(
      <span
        key={i}
        class={{
          [baseClassName]: true,
          [`${baseClassName}-start`]: isStart[i],
          [`${baseClassName}-end`]: isEnd[i],
        }}
      />,
    );
  }

  return (
    <span aria-hidden="true" class={`${prefixCls}-indent`}>
      {list}
    </span>
  );
};

export default Indent;
