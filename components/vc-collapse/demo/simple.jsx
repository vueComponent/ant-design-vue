import '../assets/index.less';
import Collapse from '../index';

const text = `
  A dog is a type of domesticated animal.
  Known for its loyalty and faithfulness,
  it can be found as a welcome guest in many households across the world.
`;

function random() {
  return parseInt(Math.random() * 10, 10) + 1;
}

const { Panel } = Collapse;
export default {
  data() {
    return {
      time: random(),
      accordion: false,
      activeKey: ['4'],
    };
  },
  methods: {
    onChange(activeKey) {
      this.activeKey = activeKey;
    },
    getItems() {
      const items = [];
      for (let i = 0, len = 3; i < len; i++) {
        const key = i + 1;
        items.push(
          <Panel header={`This is panel header ${key}`} key={String(key)} disabled={i === 0}>
            <p>{text.repeat(this.time)}</p>
          </Panel>,
        );
      }
      items.push(
        <Panel header={`This is panel header 4`} key="4">
          <Collapse defaultActiveKey="1">
            <Panel header={`This is panel nest panel`} key="1" id="header-test">
              <p>{text}</p>
            </Panel>
          </Collapse>
        </Panel>,
      );

      items.push(
        <Panel header={`This is panel header 5`} key="5">
          <Collapse defaultActiveKey="1">
            <Panel header={`This is panel nest panel`} key="1" id="another-test">
              <form>
                <label for="test">Name:&nbsp;</label>
                <input type="text" id="test" />
              </form>
            </Panel>
          </Collapse>
        </Panel>,
      );

      items.push(
        <Panel header={`This is panel header 6`} key="6" extra={<span>Extra Node</span>}>
          <p>Panel with extra</p>
        </Panel>,
      );

      return items;
    },
    setActivityKey() {
      this.activeKey = ['2'];
    },
    reRender() {
      this.time = random();
    },
    toggle() {
      this.accordion = !this.accordion;
    },
  },
  render() {
    const accordion = this.accordion;
    const btn = accordion ? 'Mode: accordion' : 'Mode: collapse';
    const activeKey = this.activeKey;
    return (
      <div style={{ margin: '20px', width: '400px' }}>
        <button onClick={this.reRender}>reRender</button>
        <button onClick={this.toggle}>{btn}</button>
        <br />
        <br />
        <button onClick={this.setActivityKey}>active header 2</button>
        <br />
        <br />
        <Collapse accordion={accordion} onChange={this.onChange} activeKey={activeKey}>
          {this.getItems()}
        </Collapse>
      </div>
    );
  },
};
