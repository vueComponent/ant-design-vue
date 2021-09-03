import { warning } from '../../vc-util/warning';
import type { ExpandableConfig, LegacyExpandableProps } from '../interface';

export const INTERNAL_COL_DEFINE = 'RC_TABLE_INTERNAL_COL_DEFINE';

export function getExpandableProps<RecordType>(
  props: LegacyExpandableProps<RecordType> & {
    expandable?: ExpandableConfig<RecordType>;
  },
): ExpandableConfig<RecordType> {
  const { expandable, ...legacyExpandableConfig } = props;

  if (props.expandable !== undefined) {
    return {
      ...legacyExpandableConfig,
      ...expandable,
    };
  }

  if (
    process.env.NODE_ENV !== 'production' &&
    [
      'indentSize',
      'expandedRowKeys',
      'defaultExpandedRowKeys',
      'defaultExpandAllRows',
      'expandedRowRender',
      'expandRowByClick',
      'expandIcon',
      'onExpand',
      'onExpandedRowsChange',
      'expandedRowClassName',
      'expandIconColumnIndex',
    ].some(prop => prop in props)
  ) {
    warning(false, 'expanded related props have been moved into `expandable`.');
  }

  return legacyExpandableConfig;
}

/**
 * Returns only data- and aria- key/value pairs
 * @param {object} props
 */
export function getDataAndAriaProps(props: object) {
  /* eslint-disable no-param-reassign */
  return Object.keys(props).reduce((memo, key) => {
    if (key.substr(0, 5) === 'data-' || key.substr(0, 5) === 'aria-') {
      memo[key] = props[key];
    }
    return memo;
  }, {});
  /* eslint-enable */
}
