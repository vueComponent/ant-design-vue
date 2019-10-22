<script>
import Trigger from '../index';
import '../assets/index.less';
import { Input, Button } from 'ant-design-vue';
function getPopupAlign(state) {
  return {
    offset: [state.offsetX, state.offsetY],
    overflow: {
      adjustX: 1,
      adjustY: 1,
    },
  };
}

const builtinPlacements = {
  left: {
    points: ['cr', 'cl'],
  },
  right: {
    points: ['cl', 'cr'],
  },
  top: {
    points: ['bc', 'tc'],
  },
  bottom: {
    points: ['tc', 'bc'],
  },
  topLeft: {
    points: ['bl', 'tl'],
  },
  topRight: {
    points: ['br', 'tr'],
  },
  bottomRight: {
    points: ['tr', 'br'],
  },
  bottomLeft: {
    points: ['tl', 'bl'],
  },
};

function preventDefault(e) {
  e.preventDefault();
}

function getPopupContainer(trigger) {
  return trigger.parentNode;
}

export default {
  data() {
    return {
      mask: false,
      maskClosable: false,
      placement: 'right',
      trigger: {
        hover: 1,
      },
      offsetX: undefined,
      offsetY: undefined,
      transitionName: 'rc-trigger-popup-zoom',
      destroyPopupOnHide: false,
      destroyed: false,
    };
  },
  methods: {
    setState(state, callback) {
      Object.assign(this.$data, state);
      this.$nextTick(() => {
        callback && callback();
      });
    },
    onPlacementChange(e) {
      this.setState({
        placement: e.target.value,
      });
    },

    onTransitionChange(e) {
      this.setState({
        transitionName: e.target.checked ? e.target.value : '',
      });
    },

    onTriggerChange(e) {
      const trigger = Object.assign({}, this.$data.trigger);
      if (e.target.checked) {
        trigger[e.target.value] = 1;
      } else {
        delete trigger[e.target.value];
      }
      this.setState({
        trigger,
      });
    },

    onOffsetXChange(e) {
      const targetValue = e.target.value;
      this.setState({
        offsetX: targetValue || undefined,
      });
    },

    onOffsetYChange(e) {
      const targetValue = e.target.value;
      this.setState({
        offsetY: targetValue || undefined,
      });
    },

    onVisibleChange(visible) {
      console.log('tooltip', visible);
    },

    onMask(e) {
      this.setState({
        mask: e.target.checked,
      });
    },

    onMaskClosable(e) {
      this.setState({
        maskClosable: e.target.checked,
      });
    },

    destroy() {
      this.setState({
        destroyed: true,
      });
    },

    handleDestroyPopupOnHide(e) {
      this.setState({
        destroyPopupOnHide: e.target.checked,
      });
    },
  },

  render() {
    const state = this.$data;
    const trigger = state.trigger;
    if (state.destroyed) {
      return null;
    }
    return (
      <div>
        <div style={{ margin: '10px 20px' }}>
          <label>
            placement:
            <select value={state.placement} onChange={this.onPlacementChange}>
              <option>right</option>
              <option>left</option>
              <option>top</option>
              <option>bottom</option>
              <option>topLeft</option>
              <option>topRight</option>
              <option>bottomRight</option>
              <option>bottomLeft</option>
            </select>
          </label>
          &nbsp;&nbsp;&nbsp;&nbsp;
          <label>
            <a-checkbox
              value="rc-trigger-popup-zoom"
              onChange={this.onTransitionChange}
              checked={state.transitionName === 'rc-trigger-popup-zoom'}
            />
            transitionName
          </label>
          &nbsp;&nbsp;&nbsp;&nbsp; trigger:
          <label>
            <a-checkbox value="hover" checked={!!trigger.hover} onChange={this.onTriggerChange} />
            hover
          </label>
          <label>
            <a-checkbox value="focus" checked={!!trigger.focus} onChange={this.onTriggerChange} />
            focus
          </label>
          <label>
            <a-checkbox value="click" checked={!!trigger.click} onChange={this.onTriggerChange} />
            click
          </label>
          <label>
            <a-checkbox
              value="contextMenu"
              checked={!!trigger.contextMenu}
              onChange={this.onTriggerChange}
            />
            contextMenu
          </label>
          &nbsp;&nbsp;&nbsp;&nbsp;
          <label>
            <a-checkbox
              checked={!!state.destroyPopupOnHide}
              onChange={this.handleDestroyPopupOnHide}
            />
            destroyPopupOnHide
          </label>
          &nbsp;&nbsp;&nbsp;&nbsp;
          <label>
            <a-checkbox checked={!!state.mask} onChange={this.onMask} />
            mask
          </label>
          &nbsp;&nbsp;&nbsp;&nbsp;
          <label>
            <a-checkbox checked={!!state.maskClosable} onChange={this.onMaskClosable} />
            maskClosable
          </label>
          <br />
          <label>
            offsetX:
            <Input type="text" onChange={this.onOffsetXChange} style={{ width: '50px' }} />
          </label>
          &nbsp;&nbsp;&nbsp;&nbsp;
          <label>
            offsetY:
            <Input type="text" onChange={this.onOffsetYChange} style={{ width: '50px' }} />
          </label>
          &nbsp;&nbsp;&nbsp;&nbsp;
          <Button onClick={this.destroy}>destroy</Button>
        </div>
        <div style={{ margin: '100px', position: 'relative' }}>
          <Trigger
            getPopupContainer={undefined && getPopupContainer}
            popupAlign={getPopupAlign(state)}
            popupPlacement={state.placement}
            destroyPopupOnHide={state.destroyPopupOnHide}
            // zIndex={40}
            mask={state.mask}
            maskClosable={state.maskClosable}
            // maskAnimation="fade"
            // mouseEnterDelay={0.1}
            // mouseLeaveDelay={0.1}
            action={Object.keys(state.trigger)}
            builtinPlacements={builtinPlacements}
            popupAnimation={state.transitionName}
          >
            <div
              slot="popup"
              style={{ border: '1px solid red', padding: '10px', background: 'white' }}
            >
              i am a popup
            </div>
            <a-button onClick={preventDefault}>trigger</a-button>
          </Trigger>
        </div>
      </div>
    );
  },
};
</script>
