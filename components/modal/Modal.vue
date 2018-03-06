<script>
import Dialog from '../vc-dialog'
import PropTypes from '../_util/vue-types'
import addEventListener from '../_util/Dom/addEventListener'
import Button from '../button'
import buttonTypes from '../button/buttonTypes'
const ButtonType = buttonTypes().type
import LocaleReceiver from '../locale-provider/LocaleReceiver'
import { getConfirmLocale } from './locale'
import { initDefaultProps, getComponentFromProp } from '../_util/props-util'

let mousePosition = null
let mousePositionEventBinded = false
function noop () {}
const modalProps = (defaultProps = {}) => {
  const props = {
    prefixCls: PropTypes.string,
    /** 对话框是否可见*/
    visible: PropTypes.bool,
    /** 确定按钮 loading*/
    confirmLoading: PropTypes.bool,
    /** 标题*/
    title: PropTypes.any,
    /** 是否显示右上角的关闭按钮*/
    closable: PropTypes.bool,
    /** 点击确定回调*/
    // onOk: (e: React.MouseEvent<any>) => void,
    /** 点击模态框右上角叉、取消按钮、Props.maskClosable 值为 true 时的遮罩层或键盘按下 Esc 时的回调*/
    // onCancel: (e: React.MouseEvent<any>) => void,
    afterClose: PropTypes.func.def(noop),
    /** 宽度*/
    width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    /** 底部内容*/
    footer: PropTypes.any,
    /** 确认按钮文字*/
    okText: PropTypes.string,
    /** 确认按钮类型*/
    okType: ButtonType,
    /** 取消按钮文字*/
    cancelText: PropTypes.string,
    /** 点击蒙层是否允许关闭*/
    maskClosable: PropTypes.bool,
    destroyOnClose: PropTypes.bool,
    wrapClassName: PropTypes.string,
    maskTransitionName: PropTypes.string,
    transitionName: PropTypes.string,
    getContainer: PropTypes.func,
    zIndex: PropTypes.number,
    bodyStyle: PropTypes.object,
    maskStyle: PropTypes.object,
    mask: PropTypes.bool,
  }
  return initDefaultProps(props, defaultProps)
}

export default {
  props: modalProps({
    prefixCls: 'ant-modal',
    width: 520,
    transitionName: 'zoom',
    maskTransitionName: 'fade',
    confirmLoading: false,
    visible: false,
    okType: 'primary',
  }),
  // static info: ModalFunc;
  // static success: ModalFunc;
  // static error: ModalFunc;
  // static warn: ModalFunc;
  // static warning: ModalFunc;
  // static confirm: ModalFunc;
  methods: {
    handleCancel (e) {
      this.$emit('cancel', e)
    },

    handleOk (e) {
      this.$emit('ok', e)
    },
    renderFooter (locale) {
      const { okType, confirmLoading } = this
      return (
        <div>
          <Button
            onClick={this.handleCancel}
          >
            {getComponentFromProp(this, 'cancelText') || locale.cancelText}
          </Button>
          <Button
            type={okType}
            loading={confirmLoading}
            onClick={this.handleOk}
          >
            {getComponentFromProp(this, 'okText') || locale.okText}
          </Button>
        </div>
      )
    },
  },
  mounted () {
    if (mousePositionEventBinded) {
      return
    }
    // 只有点击事件支持从鼠标位置动画展开
    addEventListener(document.documentElement, 'click', (e) => {
      mousePosition = {
        x: e.pageX,
        y: e.pageY,
      }
      // 100ms 内发生过点击事件，则从点击位置动画展示
      // 否则直接 zoom 展示
      // 这样可以兼容非点击方式展开
      setTimeout(() => { mousePosition = null }, 100)
    })
    mousePositionEventBinded = true
  },

  render () {
    const { visible, $listeners, $slots } = this

    const defaultFooter = (
      <LocaleReceiver
        componentName='Modal'
        defaultLocale={getConfirmLocale()}
        children={this.renderFooter}
      />
    )
    const dialogProps = {
      props: {
        ...this.$props,
        title: getComponentFromProp(this, 'title'),
        footer: getComponentFromProp(this, 'footer') || defaultFooter,
        visible: visible,
        mousePosition,
      },
      on: {
        ...$listeners,
        close: this.handleCancel,
      },
    }
    return (
      <Dialog {...dialogProps}>
        {$slots.default}
      </Dialog>
    )
  },
}

</script>
