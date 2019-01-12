import Drawer from '../src/index';
import Button from '../../button/index';
import '../assets/index.less';
import '../../menu/style/index';
import '../../icon/style/index';
import '../../button/style/index';

export default {
  data() {
    return {
      open: false,
      openChild: false,
      openChildren: false,
    };
  },
  methods: {
    onClick() {
      this.open = !this.open;
    },
    onChildClick() {
      this.openChild = !this.openChild;
    },
    onChildrenClick() {
      this.openChildren = !this.openChildren;
    },
    getLevelMove(e) {
      const target = e.target;
      if (target.className.indexOf('drawer1') >= 0) {
        return [200, 100];
      }
      return 100;
    },
  },
  render() {
    return (
      <div>
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
          <Button onClick={this.onClick}>打开抽屉</Button>
        </div>
        <Drawer
          width="20vw"
          handler={false}
          open={this.open}
          onMaskClick={this.onClick}
          class="drawer1"
          placement="right"
        >
          <div>
            <Button onClick={this.onChildClick}>打开子级</Button>
            <Drawer
              handler={false}
              open={this.openChild}
              onMaskClick={this.onChildClick}
              class="drawer2"
              level=".drawer1"
              placement="right"
              levelMove={100}
            >
              <div style={{ width: 200 }}>
                二级抽屉
                <Button onClick={this.onChildrenClick}>打开子级</Button>
                <Drawer
                  handler={false}
                  open={this.openChildren}
                  onMaskClick={this.onChildrenClick}
                  level={['.drawer1', '.drawer2']}
                  placement="right"
                  levelMove={this.getLevelMove}
                >
                  <div style={{ width: 200 }}>三级抽屉</div>
                </Drawer>
              </div>
            </Drawer>
          </div>
        </Drawer>
      </div>
    );
  },
};
