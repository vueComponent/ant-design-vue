import Menu, { Item as MenuItem, Divider } from '../../vc-menu/index';
import Dropdown from '../src/index.js';
import '../assets/index.less';

export default {
  data() {
    return {};
  },
  methods: {
    onSelect({ key }) {
      console.log(`${key} selected`);
    },
    onVisibleChange(visible) {
      console.log(visible);
    },
  },
  render() {
    return (
      <div style="margin: 100px">
        <div style="height: 100px" />
        <div>
          <Dropdown trigger={['click']} animation="slide-up" onVisibleChange={this.onVisibleChange}>
            <Menu slot="overlay" onSelect={this.onSelect}>
              <MenuItem disabled>disabled</MenuItem>
              <MenuItem key="1">one</MenuItem>
              <Divider />
              <MenuItem key="2">two</MenuItem>
            </Menu>
            <button style="width: 100px">open</button>
          </Dropdown>
        </div>
      </div>
    );
  },
};
