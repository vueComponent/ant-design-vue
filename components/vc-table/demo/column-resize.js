/* eslint-disable no-console,func-names */
import Table from '../index';
import '../assets/index.less';
import BaseMixin from '../../_util/BaseMixin';

const ResizeableTitle = (h, props, children) => {
  console.log(props);
  const { width, ...restProps } = props;

  if (!width) {
    return <th {...restProps}>{children}</th>;
  }
  return (
    <th {...restProps} width={width}>
      {children}
    </th>
  );
};

export default {
  mixins: [BaseMixin],
  data() {
    return {
      columns: [
        { title: 'title1', dataIndex: 'a', key: 'a', width: 100 },
        { id: '123', title: 'title2', dataIndex: 'b', key: 'b', width: 100 },
        { title: 'title3', dataIndex: 'c', key: 'c', width: 200 },
        {
          title: 'Operations',
          dataIndex: '',
          key: 'd',
          customRender: () => {
            return <a href="#">Operations</a>;
          },
        },
      ],
      data: [
        { a: '123', key: '1' },
        { a: 'cdd', b: 'edd', key: '2' },
        { a: '1333', c: 'eee', d: 2, key: '3' },
      ],
      components: {
        header: {
          cell: ResizeableTitle,
        },
      },
    };
  },
  methods: {
    handleResize(index) {
      return (e, { size }) => {
        this.setState(({ columns }) => {
          const nextColumns = [...columns];
          nextColumns[index] = {
            ...nextColumns[index],
            width: size.width,
          };
          return { columns: nextColumns };
        });
      };
    },
  },

  render() {
    const columns = this.columns.map((col, index) => ({
      ...col,
      customHeaderCell: column => ({
        props: {
          width: column.width,
        },
        on: {
          resize: this.handleResize(index),
        },
      }),
    }));

    return (
      <div>
        <h2>Integrate with react-resizable</h2>
        <Table components={this.components} columns={columns} data={this.data} />
      </div>
    );
  },
};
