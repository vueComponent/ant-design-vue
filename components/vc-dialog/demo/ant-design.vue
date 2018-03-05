<script>
/* eslint no-console:0 */

import '../assets/index.less'
// use import Dialog from 'rc-dialog'
import Dialog from '../DialogWrap'

export default {
  data () {
    return {
      visible: false,
      width: 600,
      destroyOnClose: false,
      center: false,
      mousePosition: {},
    }
  },
  methods: {
    onClick (e) {
      this.visible = true
      this.mousePosition = {
        x: e.pageX,
        y: e.pageY,
      }
    },

    onClose (e) {
    // console.log(e);
      this.visible = false
    },

    onDestroyOnCloseChange (e) {
      this.destroyOnClose = e.target.checked
    },

    changeWidth (e) {
      console.log(e)
      this.width = this.width === 600 ? 800 : 600
    },

    handleCenter (e) {
      this.center = e.target.checked
    },
  },

  render () {
    const style = {
      width: this.width + 'px',
    }
    let wrapClassName = ''
    if (this.center) {
      wrapClassName = 'center'
    }
    const dialog = (
      <Dialog
        visible={this.visible}
        wrapClassName={wrapClassName}
        animation='zoom'
        maskAnimation='fade'
        onClose={this.onClose}
        style={style}
        mousePosition={this.mousePosition}
        destroyOnClose={this.destroyOnClose}
      >
        <input />
        <p>basic modal</p>
        <button onClick={this.changeWidth}>change width</button>
        <div style={{ height: '200px' }} />
      </Dialog>
    )
    return (
      <div>
        <h2>ant-design dialog</h2>
        <div style={{ width: '90%', margin: '0 auto' }}>
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
            <button className='btn btn-primary' onClick={this.onClick}>
            show dialog
            </button>
          &nbsp;
            <label>
            destroy on close:
              <input
                type='checkbox'
                checked={this.destroyOnClose}
                onChange={this.onDestroyOnCloseChange}
              />
            </label>
          &nbsp;
            <label>
            center
              <input
                type='checkbox'
                checked={this.center}
                onChange={this.handleCenter}
              />
            </label>
          </p>
          {dialog}
        </div>
      </div>
    )
  },
}
</script>