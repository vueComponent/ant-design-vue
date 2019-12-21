/* eslint-disable no-console,func-names */
import Table from '../index';
import '../assets/index.less';

const tableData = [
  { key: 0, a: '123' },
  { key: 1, a: 'cdd', b: 'edd' },
  { key: 2, a: '1333', c: 'eee', d: 2 },
];

export default {
  data() {
    return {
      data: tableData,
      expandedRowKeys: [],
      expandIconAsCell: true,
      expandRowByClick: false,
      columns: [
        { title: 'title 1', dataIndex: 'a', key: 'a', width: 100 },
        { title: 'title 2', dataIndex: 'b', key: 'b', width: 100 },
        { title: 'title 3', dataIndex: 'c', key: 'c', width: 200 },
        { title: 'Operation', dataIndex: '', key: 'x', customRender: this.renderAction },
      ],
    };
  },
  methods: {
    onExpand(expanded, record) {
      console.log('onExpand', expanded, record);
    },

    onExpandedRowsChange(rows) {
      this.expandedRowKeys = rows;
    },

    onExpandIconAsCellChange(e) {
      this.expandIconAsCell = e.target.checked;
    },

    onExpandRowByClickChange(e) {
      this.expandRowByClick = e.target.checked;
    },

    toggleButton() {
      if (this.expandedRowKeys.length) {
        const closeAll = () => {
          this.expandedRowKeys = [];
        };
        return <button onClick={closeAll}>Close All</button>;
      }
      const openAll = () => {
        this.expandedRowKeys = [0, 1, 2];
      };
      return <button onClick={openAll}>Expand All</button>;
    },

    remove(index) {
      const data = this.data;
      data.splice(index, 1);
      this.data = data;
    },

    renderAction(o, row, index) {
      return (
        <a href="#" onClick={() => this.remove(index)}>
          Delete
        </a>
      );
    },
  },

  render() {
    const { expandIconAsCell, expandRowByClick, expandedRowKeys, data } = this;
    return (
      <div>
        <h2>expandedRowRender</h2>
        <div>
          {this.toggleButton()}
          <span style={{ display: 'inline-block', width: '20px' }} />
          <input
            type="checkbox"
            checked={expandIconAsCell}
            onChange={this.onExpandIconAsCellChange}
          />
          expandIconAsCell
          <span style={{ display: 'inline-block', width: '20px' }} />
          <input
            type="checkbox"
            checked={expandRowByClick}
            onChange={this.onExpandRowByClickChange}
          />
          expandRowByClick
          <Table
            columns={this.columns}
            expandIconAsCell={expandIconAsCell}
            expandRowByClick={expandRowByClick}
            expandedRowRender={(record, index, indent, expanded) =>
              expanded ? <p>extra: {record.a}</p> : null
            }
            expandedRowKeys={expandedRowKeys}
            onExpandedRowsChange={this.onExpandedRowsChange}
            onExpand={this.onExpand}
            data={data}
          />
        </div>
      </div>
    );
  },
};
