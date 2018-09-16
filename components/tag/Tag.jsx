import PropTypes from '../_util/vue-types'
import Icon from '../icon'
import getTransitionProps from '../_util/getTransitionProps'
import omit from 'omit.js'
import Wave from '../_util/wave'
import { hasProp, getOptionProps } from '../_util/props-util'
import BaseMixin from '../_util/BaseMixin'

export default {
  name: 'ATag',
  mixins: [BaseMixin],
  props: {
    prefixCls: PropTypes.string.def('ant-tag'),
    color: PropTypes.string,
    closable: PropTypes.bool,
    visible: PropTypes.bool,
  },
  model: {
    prop: 'visible',
    event: 'close.visible',
  },
  data () {
    const props = getOptionProps(this)
    let state = {}
    if ('visible' in props) {
      state = {
        _visible: props.visible,
        _closed: !props.visible,
      }
    }
    state = {
      _closing: false,
      _closed: false,
      _visible: true,
      ...state,
    }
    this.pre_visible = state._visible
    return state
  },
  watch: {
    visible (val) {
      this.setState({
        _visible: val,
      })
    },
  },
  updated () {
    this.$nextTick(() => {
      if (this.pre_visible && !this.$data._visible) {
        this.close()
      } else if (!this.pre_visible && this.$data._visible) {
        this.show()
      }
      this.pre_visible = this.$data._visible
    })
  },
  methods: {
    handleIconClick (e) {
      this.$emit('close', e)
      this.$emit('close.visible', false)
      if (e.defaultPrevented || hasProp(this, 'visible')) {
        return
      }
      this.setState({ _visible: false })
    },
    close  () {
      if (this.$data._closing || this.$data._closed) {
        return
      }
      const dom = this.$el
      dom.style.width = `${dom.getBoundingClientRect().width}px`
      // It's Magic Code, don't know why
      dom.style.width = `${dom.getBoundingClientRect().width}px`
      this.setState({
        _closing: true,
      })
    },

    show  () {
      this.setState({
        _closed: false,
      })
    },

    animationEnd  (_, existed) {
      if (!existed && !this.$data._closed) {
        this.setState({
          _closed: true,
          _closing: false,
        })

        const afterClose = this.afterClose
        if (afterClose) {
          afterClose()
        }
      } else {
        this.setState({
          _closed: false,
        })
      }
    },

    isPresetColor (color) {
      if (!color) { return false }
      return (
        /^(pink|red|yellow|orange|cyan|green|blue|purple|geekblue|magenta|volcano|gold|lime)(-inverse)?$/
          .test(color)
      )
    },
  },

  render () {
    const { prefixCls, closable, color } = this.$props
    const closeIcon = closable ? <Icon type='cross' onClick={this.handleIconClick} /> : ''
    const isPresetColor = this.isPresetColor(color)
    const cls = {
      [`${prefixCls}`]: true,
      [`${prefixCls}-${color}`]: isPresetColor,
      [`${prefixCls}-has-color`]: (color && !isPresetColor),
      [`${prefixCls}-close`]: this.$data._closing,
    }

    const tagStyle = {
      backgroundColor: (color && !isPresetColor) ? color : null,
    }
    const tag = this.$data._closed ? <span /> : (
      <div
        v-show={!this.$data._closing}
        {...{ on: omit(this.$listeners, ['close']) }}
        class={cls}
        style={tagStyle}
      >
        {this.$slots.default}
        {closeIcon}
      </div>
    )
    const transitionProps = this.$data._closed ? {} : getTransitionProps(`${prefixCls}-zoom`, {
      afterLeave: () => this.animationEnd(undefined, false),
      afterEnter: () => this.animationEnd(undefined, true),
    })
    return (
      <Wave>
        <transition
          {...transitionProps}
        >
          {tag}
        </transition>
      </Wave>
    )
  },
}

