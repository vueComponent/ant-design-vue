// base rc-table 6.10.9
import Table from './src/Table';
import Column from './src/Column';
import ColumnGroup from './src/ColumnGroup';
import { INTERNAL_COL_DEFINE } from './src/utils';
// const Table = {
//   name: 'Table',
//   inheritAttrs: false,
//   Column,
//   ColumnGroup,
//   props: T.props,
//   methods: {
//     getTableNode() {
//       return this.table.tableNode;
//     },
//     getBodyTable() {
//       return this.table.ref_bodyTable;
//     },
//     saveTable(node) {
//       this.table = node;
//     },
//   },
//   render() {
//     const props = getOptionProps(this);
//     const columns = props.columns;
//     const tProps = {
//       ...props,
//       ...this.$attrs,
//       columns,
//       ref: this.saveTable,
//     };
//     return <T {...tProps} />;
//   },
// };

export default Table;
export { Column, ColumnGroup, INTERNAL_COL_DEFINE };
