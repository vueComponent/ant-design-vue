import Drawer from '../src/index';
import Menu from '../../menu/index';
import Icon from '../../icon/index';
import '../assets/index.less';
import '../../menu/style/index';
import '../../icon/style/index';

const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;

export default {
  data() {
    return {
      open: true,
    };
  },
  mounted() {
    this.$nextTick(() => {
      setTimeout(() => {
        this.open = false;
      }, 2000);
    });
  },
  methods: {
    onChange(bool) {
      console.log(bool);
    },
    onTouchEnd() {
      this.open = false;
    },
    onSwitch() {
      this.open = !this.open;
    },
  },
  render() {
    return (
      <div>
        <Drawer
          onChange={this.onChange}
          open={this.open}
          onMaskClick={this.onTouchEnd}
          handler={false}
          level={null}
          width="20vw"
        >
          <Menu defaultSelectedKeys={['1']} defaultOpenKeys={['sub1']} mode="inline">
            <SubMenu
              key="sub1"
              title={
                <span>
                  <Icon type="mail" />
                  <span>Navigation One</span>
                </span>
              }
            >
              <MenuItemGroup key="g1" title="Item 1">
                <Menu.Item key="1">Option 1</Menu.Item>
                <Menu.Item key="2">Option 2</Menu.Item>
              </MenuItemGroup>
              <MenuItemGroup key="g2" title="Item 2">
                <Menu.Item key="3">Option 3</Menu.Item>
                <Menu.Item key="4">Option 4</Menu.Item>
              </MenuItemGroup>
            </SubMenu>
            <SubMenu
              key="sub2"
              title={
                <span>
                  <Icon type="appstore" />
                  <span>Navigation Two</span>
                </span>
              }
            >
              <Menu.Item key="5">Option 5</Menu.Item>
              <Menu.Item key="6">Option 6</Menu.Item>
              <SubMenu key="sub3" title="Submenu">
                <Menu.Item key="7">Option 7</Menu.Item>
                <Menu.Item key="8">Option 8</Menu.Item>
              </SubMenu>
            </SubMenu>
            <SubMenu
              key="sub4"
              title={
                <span>
                  <Icon type="setting" />
                  <span>Navigation Three</span>
                </span>
              }
            >
              <Menu.Item key="9">Option 9</Menu.Item>
              <Menu.Item key="10">Option 10</Menu.Item>
              <Menu.Item key="11">Option 11</Menu.Item>
              <Menu.Item key="12">Option 12</Menu.Item>
            </SubMenu>
          </Menu>
        </Drawer>
        <div
          style={{
            width: '100%',
            height: 667,
            background: '#fff000',
            color: '#fff',
            textAlign: 'center',
            lineHeight: '667px',
          }}
        >
          内容区块
          <button
            onClick={this.onSwitch}
            style={{ height: 24, width: 100, marginLeft: 20, color: '#000', lineHeight: '24px' }}
          >
            {!this.open ? '打开' : '关闭'}
          </button>
        </div>
      </div>
    );
  },
};
