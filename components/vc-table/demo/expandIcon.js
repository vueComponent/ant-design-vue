/* eslint-disable no-console,func-names */
import Table from '../index';
import '../assets/index.less';

const data = [
  { key: 0, a: '123' },
  { key: 1, a: 'cdd', b: 'edd' },
  { key: 2, a: '1333', c: 'eee', d: 2 },
];

const columns = [
  { title: 'title 1', dataIndex: 'a', key: 'a', width: 100 },
  { title: 'title 2', dataIndex: 'b', key: 'b', width: 100 },
  { title: 'title 3', dataIndex: 'c', key: 'c', width: 200 },
];
export default {
  methods: {
    CustomExpandIcon(props) {
      let text;
      if (props.expanded) {
        text = <span>&#8679; collapse</span>;
      } else {
        text = <span>&#8681; expand</span>;
      }
      return (
        <a
          class="expand-row-icon"
          onClick={e => props.onExpand(props.record, e)}
          style={{ color: 'blue', cursor: 'pointer' }}
        >
          {text}
        </a>
      );
    },
    onExpand(expanded, record) {
      console.log('onExpand', expanded, record);
    },
  },
  render() {
    return (
      <div>
        <h2>expandIcon</h2>
        <div>
          <Table
            columns={columns}
            expandedRowRender={record => <p>extra: {record.a}</p>}
            onExpand={this.onExpand}
            expandIcon={this.CustomExpandIcon}
            expandIconAsCell
            data={data}
          />
        </div>
      </div>
    );
  },
};
