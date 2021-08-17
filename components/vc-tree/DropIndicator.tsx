import type { CSSProperties } from 'vue';

export default function DropIndicator({
  dropPosition,
  dropLevelOffset,
  indent,
}: {
  dropPosition: -1 | 0 | 1;
  dropLevelOffset: number;
  indent: number;
}) {
  const style: CSSProperties = {
    pointerEvents: 'none',
    position: 'absolute',
    right: 0,
    backgroundColor: 'red',
    height: `${2}px`,
  };
  switch (dropPosition) {
    case -1:
      style.top = 0;
      style.left = `${-dropLevelOffset * indent}px`;
      break;
    case 1:
      style.bottom = 0;
      style.left = `${-dropLevelOffset * indent}px`;
      break;
    case 0:
      style.bottom = 0;
      style.left = `${indent}`;
      break;
  }
  return <div style={style} />;
}
