<script>
/* eslint no-console:0 */

import '../assets/index.less';
// use import Dialog from 'rc-dialog'
import Dialog from '../index';

const clearPath =
  'M793 242H366v-74c0-6.7-7.7-10.4-12.9' +
  '-6.3l-142 112c-4.1 3.2-4.1 9.4 0 12.6l142 112c' +
  '5.2 4.1 12.9 0.4 12.9-6.3v-74h415v470H175c-4.4' +
  ' 0-8 3.6-8 8v60c0 4.4 3.6 8 8 8h618c35.3 0 64-' +
  '28.7 64-64V306c0-35.3-28.7-64-64-64z';

export default {
  data() {
    return {
      visible: false,
      width: 600,
      destroyOnClose: false,
      center: false,
      mousePosition: undefined,
      useIcon: false,
      forceRender: false,
    };
  },
  methods: {
    getSvg(path, props = {}, align = false) {
      return (
        <i {...{ props }}>
          <svg
            viewBox="0 0 1024 1024"
            width="1em"
            height="1em"
            fill="currentColor"
            style={align ? { verticalAlign: '-.125em ' } : {}}
          >
            <path d={path} p-id="5827"></path>
          </svg>
        </i>
      );
    },
    onClick(e) {
      this.visible = true;
      this.mousePosition = {
        x: e.pageX,
        y: e.pageY,
      };
    },

    onClose() {
      // console.log(e);
      this.visible = false;
    },

    onDestroyOnCloseChange(e) {
      this.destroyOnClose = e.target.checked;
    },

    onForceRenderChange(e) {
      this.forceRender = e.target.checked;
    },

    changeWidth() {
      this.width = this.width === 600 ? 800 : 600;
    },

    handleCenter(e) {
      this.center = e.target.checked;
    },
    toggleCloseIcon() {
      this.useIcon = !this.useIcon;
    },
  },

  render() {
    const style = {
      width: this.width + 'px',
    };
    let wrapClassName = '';
    if (this.center) {
      wrapClassName = 'center';
    }
    const dialog = (
      <Dialog
        // getContainer={() => this.$refs.container}
        visible={this.visible}
        wrapClassName={wrapClassName}
        animation="zoom"
        maskAnimation="fade"
        onClose={this.onClose}
        style={style}
        mousePosition={this.mousePosition}
        destroyOnClose={this.destroyOnClose}
        closeIcon={this.useIcon ? this.getSvg(clearPath, {}, true) : undefined}
        forceRender={this.forceRender}
      >
        <input autoFocus />
        <p>basic modal</p>
        <button onClick={this.changeWidth}>change width</button>
        <button onClick={this.toggleCloseIcon}>
          use custom icon, is using icon: {(this.useIcon && 'true') || 'false'}.
        </button>
        <div style={{ height: '200px' }} />
      </Dialog>
    );
    return (
      <div>
        <h2>ant-design dialog</h2>
        <div style={{ width: '90%', margin: '0 auto' }} ref="container">
          <style>
            {`
            .center {
              display: flex;
              align-items: center;
              justify-content: center;
            }
            `}
          </style>
          <p>
            <button className="btn btn-primary" onClick={this.onClick}>
              show dialog
            </button>
            &nbsp;
            <label>
              destroy on close:
              <input
                type="checkbox"
                checked={this.destroyOnClose}
                onChange={this.onDestroyOnCloseChange}
              />
            </label>
            &nbsp;
            <label>
              center
              <input type="checkbox" checked={this.center} onChange={this.handleCenter} />
            </label>
            &nbsp;
            <label>
              force render
              <input
                type="checkbox"
                checked={this.forceRender}
                onChange={this.onForceRenderChange}
              />
            </label>
          </p>
          {dialog}
        </div>
      </div>
    );
  },
};
</script>
