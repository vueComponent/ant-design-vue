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

const arrowPath =
  'M869 487.8L491.2 159.9c-2.9-2.5-6.6-3.9-10.5-3.9h-88' +
  '.5c-7.4 0-10.8 9.2-5.2 14l350.2 304H152c-4.4 0-8 3.6-8 8v60c0 4.4 3.' +
  '6 8 8 8h585.1L386.9 854c-5.6 4.9-2.2 14 5.2 14h91.5c1.9 0 3.8-0.7 5.' +
  '2-2L869 536.2c14.7-12.8 14.7-35.6 0-48.4z';

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
          <Collapse defaultActiveKey="1" expandIcon={this.expandIcon}>
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
    expandIcon({ isActive }) {
      return (
        <i style={{ marginRight: '.5rem' }}>
          <svg
            viewBox="0 0 1024 1024"
            width="1em"
            height="1em"
            fill="currentColor"
            style={{
              verticalAlign: '-.125em',
              transition: 'transform .2s',
              transform: `rotate(${isActive ? 90 : 0}deg)`,
            }}
          >
            <path d={arrowPath} p-id="5827" />
          </svg>
        </i>
      );
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
        <Collapse
          accordion={accordion}
          onChange={this.onChange}
          activeKey={activeKey}
          expandIcon={this.expandIcon}
        >
          {this.getItems()}
        </Collapse>
      </div>
    );
  },
};
