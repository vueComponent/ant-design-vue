// base rc-table@7.22.2
import Table from './Table';
import { FooterComponents as Summary, SummaryCell, SummaryRow } from './Footer';
import Column from './sugar/Column';
import ColumnGroup from './sugar/ColumnGroup';
import { INTERNAL_COL_DEFINE } from './utils/legacyUtil';
import { EXPAND_COLUMN } from './constant';

export {
  Summary,
  Column,
  ColumnGroup,
  SummaryCell,
  SummaryRow,
  INTERNAL_COL_DEFINE,
  EXPAND_COLUMN,
};

export default Table;
