<script>
import Trigger from '../index';
import '../assets/index.less';
import './point.less';
const builtinPlacements = {
  topLeft: {
    points: ['tl', 'tl'],
  },
};

export default {
  data() {
    return {
      action: 'click',
      mouseEnterDelay: 0,
    };
  },
  methods: {
    onActionChange({ target: { value } }) {
      this.action = value;
    },

    onDelayChange({ target: { value } }) {
      this.mouseEnterDelay = Number(value) || 0;
    },
  },

  render() {
    const { action, mouseEnterDelay } = this;
    const innerTrigger = (
      <div style={{ padding: '20px', background: 'rgba(0, 255, 0, 0.3)' }}>This is popup</div>
    );
    return (
      <div>
        <label>
          Trigger type:{' '}
          <select value={action} onChange={this.onActionChange}>
            <option>click</option>
            <option>hover</option>
            <option>contextmenu</option>
          </select>
        </label>{' '}
        {action === 'hover' && (
          <label>
            Mouse enter delay:{' '}
            <input type="text" value={mouseEnterDelay} onChange={this.onDelayChange} />
          </label>
        )}
        <div style={{ margin: '50px' }}>
          <Trigger
            popupPlacement="topLeft"
            action={[action]}
            popupAlign={{
              overflow: {
                adjustX: 1,
                adjustY: 1,
              },
            }}
            mouseEnterDelay={mouseEnterDelay}
            popupClassName="point-popup"
            builtinPlacements={builtinPlacements}
            popup={innerTrigger}
            alignPoint
          >
            <div
              style={{
                border: '1px solid red',
                padding: '100px 0',
                textAlign: 'center',
              }}
            >
              Interactive region
            </div>
          </Trigger>
        </div>
      </div>
    );
  },
};
</script>
