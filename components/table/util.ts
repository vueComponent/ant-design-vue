import { camelize, flattenChildren } from '../_util/props-util';
import type { ColumnType, ColumnsType, ColumnTitle, ColumnTitleProps, Key } from './interface';

export function getColumnKey<RecordType>(column: ColumnType<RecordType>, defaultKey: string): Key {
  if ('key' in column && column.key !== undefined && column.key !== null) {
    return column.key;
  }
  if (column.dataIndex) {
    return (Array.isArray(column.dataIndex) ? column.dataIndex.join('.') : column.dataIndex) as Key;
  }

  return defaultKey;
}

export function getColumnPos(index: number, pos?: string) {
  return pos ? `${pos}-${index}` : `${index}`;
}

export function renderColumnTitle<RecordType>(
  title: ColumnTitle<RecordType>,
  props: ColumnTitleProps<RecordType>,
) {
  if (typeof title === 'function') {
    return title(props);
  }

  return title;
}

export function convertChildrenToColumns<RecordType>(
  elements: any[] = [],
): ColumnsType<RecordType> {
  const flattenElements = flattenChildren(elements);
  const columns = [];
  flattenElements.forEach(element => {
    if (!element) {
      return;
    }
    const key = element.key;
    const style = element.props?.style || {};
    const cls = element.props?.class || '';
    const props = element.props || {};
    for (const [k, v] of Object.entries(props)) {
      props[camelize(k)] = v;
    }
    const { default: children, ...restSlots } = element.children || {};
    const column = { ...restSlots, ...props, style, class: cls };
    if (key) {
      column.key = key;
    }
    if (element.type?.__ANT_TABLE_COLUMN_GROUP) {
      column.children = convertChildrenToColumns(
        typeof children === 'function' ? children() : children,
      );
    } else {
      const customRender = element.children?.default;
      column.customRender = column.customRender || customRender;
    }
    columns.push(column);
  });
  return columns;
}
