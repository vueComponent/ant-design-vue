import Drawer from '../src/index';
import Menu from '../../menu/index';
import Icon from '../../icon/index';
import '../assets/index.less';
import '../../menu/style/index';
import '../../icon/style/index';
import '../../button/style/index';
import '../../select/style/index';

const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;

export default {
  data() {
    return {
      placement: 'right',
      childShow: true,
      width: '20vw',
      height: null,
    };
  },
  methods: {
    onChange(event) {
      const value = event.target.value;
      this.placement = value;
      this.width = value === 'right' || value === 'left' ? '20vw' : null;
      this.height = value === 'right' || value === 'left' ? null : '20vh';
      this.childShow = false; // 删除子级，删除切换时的过渡动画。。。
      this.$nextTick(() => {
        this.childShow = true;
      });
    },
  },
  render() {
    return (
      <div>
        {this.childShow && (
          <Drawer placement={this.placement} width={this.width} height={this.height}>
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
        )}
        <div
          style={{
            width: '100%',
            height: 667,
            background: '#fff000',
            color: '#000',
            textAlign: 'center',
            lineHeight: '667px',
          }}
        >
          选择位置：
          <select
            style={{ width: '120px', marginLeft: '20px' }}
            value={this.placement}
            onChange={this.onChange}
          >
            <option value="left">左边 left</option>
            <option value="top">上面 top</option>
            <option value="right">右边 right</option>
            <option value="bottom">下面 bottom</option>
          </select>
        </div>
      </div>
    );
  },
};
