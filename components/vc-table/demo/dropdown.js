/* eslint-disable no-console,func-names */
import Table from '../index';
import '../assets/index.less';
import Menu from '../../menu';
const Item = Menu.Item;
const Divider = Menu.Divider;
import DropDown from '../../dropdown';

const data = [];
for (let i = 0; i < 10; i++) {
  data.push({
    key: i,
    a: `a${i}`,
    b: `b${i}`,
    c: `c${i}`,
  });
}

export default {
  data() {
    this.filters = [];
    return {
      visible: false,
    };
  },
  methods: {
    handleVisibleChange(visible) {
      this.visible = visible;
    },

    handleSelect(selected) {
      this.filters.push(selected);
    },

    handleDeselect(key) {
      const index = this.filters.indexOf(key);
      if (index !== -1) {
        this.filters.splice(index, 1);
      }
    },

    confirmFilter() {
      console.log(this.filters.join(','));
      this.visible = false;
    },
  },

  render() {
    const menu = (
      <Menu
        style={{ width: '200px' }}
        multiple
        selectable
        onSelect={this.handleSelect}
        onDeselect={this.handleDeselect}
      >
        <Item key="1">one</Item>
        <Item key="2">two</Item>
        <Item key="3">three</Item>
        <Divider />
        <Item disabled>
          <button
            style={{
              cursor: 'pointer',
              color: '#000',
              pointerEvents: 'visible',
            }}
            onClick={this.confirmFilter}
          >
            确定
          </button>
        </Item>
      </Menu>
    );

    const columns = [
      {
        title: (
          <div>
            title1
            <DropDown
              trigger={['click']}
              onVisibleChange={this.handleVisibleChange}
              visible={this.visible}
            >
              <template slot="overlay">{menu}</template>
              <a href="#">filter</a>
            </DropDown>
          </div>
        ),
        key: 'a',
        dataIndex: 'a',
        width: 100,
      },
      { title: 'title2', key: 'b', dataIndex: 'b', width: 100 },
      { title: 'title3', key: 'c', dataIndex: 'c', width: 200 },
    ];

    return (
      <div>
        <h2>use dropdown</h2>
        <Table columns={columns} data={data} rowKey={record => record.key} />
      </div>
    );
  },
};
