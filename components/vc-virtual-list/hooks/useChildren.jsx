import { Item } from '../Item';

export default function useChildren(
  list,
  startIndex,
  endIndex,
  setNodeRef,
  renderFunc,
  { getKey },
) {
  return list.slice(startIndex, endIndex + 1).map((item, index) => {
    const eleIndex = startIndex + index;
    const node = renderFunc(item, eleIndex, {
      // style: status === 'MEASURE_START' ? { visibility: 'hidden' } : {},
    });
    const key = getKey(item);
    return (
      <Item key={key} setRef={ele => setNodeRef(item, ele)}>
        {node}
      </Item>
    );
  });
}
