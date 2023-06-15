import { warning } from '../../vc-util/warning';
import type { ExpandableConfig, LegacyExpandableProps } from '../interface';

export const INTERNAL_COL_DEFINE = 'RC_TABLE_INTERNAL_COL_DEFINE';

export function getExpandableProps<RecordType>(
  props: LegacyExpandableProps<RecordType> & {
    expandable?: ExpandableConfig<RecordType>;
  },
): ExpandableConfig<RecordType> {
  const { expandable, ...legacyExpandableConfig } = props;
  let config: ExpandableConfig<RecordType>;
  if (props.expandable !== undefined) {
    config = {
      ...legacyExpandableConfig,
      ...expandable,
    };
  } else {
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
        'showExpandColumn',
      ].some(prop => prop in props)
    ) {
      warning(false, 'expanded related props have been moved into `expandable`.');
    }

    config = legacyExpandableConfig;
  }
  if (config.showExpandColumn === false) {
    config.expandIconColumnIndex = -1;
  }

  return config;
}

/**
 * Returns only data- and aria- key/value pairs
 * @param {object} props
 */
export function getDataAndAriaProps(props: object) {
  /* eslint-disable no-param-reassign */
  return Object.keys(props).reduce((memo, key) => {
    if (key.startsWith('data-') || key.startsWith('aria-')) {
      memo[key] = props[key];
    }
    return memo;
  }, {});
  /* eslint-enable */
}
