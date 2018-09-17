
import TransitionEvents from './css-animation/Event'

export default {
  name: 'Wave',
  props: ['insertExtraNode'],
  mounted () {
    this.$nextTick(() => {
      this.instance = this.bindAnimationEvent(this.$el)
    })
  },

  beforeDestroy () {
    if (this.instance) {
      this.instance.cancel()
    }
  },
  methods: {
    isNotGrey (color) {
      const match = (color || '').match(/rgba?\((\d*), (\d*), (\d*)(, [\.\d]*)?\)/)
      if (match && match[1] && match[2] && match[3]) {
        return !(match[1] === match[2] && match[2] === match[3])
      }
      return true
    },

    onClick (node, waveColor) {
      if (node.className.indexOf('-leave') >= 0) {
        return
      }
      this.removeExtraStyleNode()
      const { insertExtraNode } = this.$props
      this.extraNode = document.createElement('div')
      const extraNode = this.extraNode
      extraNode.className = 'ant-click-animating-node'
      const attributeName = this.getAttributeName()
      node.removeAttribute(attributeName)
      node.setAttribute(attributeName, 'true')
      // Not white or transparnt or grey
      if (waveColor &&
          waveColor !== '#ffffff' &&
          waveColor !== 'rgb(255, 255, 255)' &&
          this.isNotGrey(waveColor) &&
          !/rgba\(\d*, \d*, \d*, 0\)/.test(waveColor) && // any transparent rgba color
          waveColor !== 'transparent') {
        extraNode.style.borderColor = waveColor
        this.styleForPesudo = document.createElement('style')
        this.styleForPesudo.innerHTML =
          `[ant-click-animating-without-extra-node]:after { border-color: ${waveColor}; }`
        document.body.appendChild(this.styleForPesudo)
      }
      if (insertExtraNode) {
        node.appendChild(extraNode)
      }
      TransitionEvents.addEndEventListener(node, this.onTransitionEnd)
    },

    bindAnimationEvent (node) {
      if (!node ||
        !node.getAttribute ||
        node.getAttribute('disabled') ||
        node.className.indexOf('disabled') >= 0) {
        return
      }
      const onClick = (e) => {
        // Fix radio button click twice
        if (e.target.tagName === 'INPUT') {
          return
        }
        this.resetEffect(node)
        // Get wave color from target
        const waveColor =
          getComputedStyle(node).getPropertyValue('border-top-color') || // Firefox Compatible
          getComputedStyle(node).getPropertyValue('border-color') ||
          getComputedStyle(node).getPropertyValue('background-color')
        this.clickWaveTimeoutId = window.setTimeout(() => this.onClick(node, waveColor), 0)
      }
      node.addEventListener('click', onClick, true)
      return {
        cancel: () => {
          node.removeEventListener('click', onClick, true)
        },
      }
    },
    getAttributeName () {
      const { insertExtraNode } = this.$props
      return insertExtraNode ? 'ant-click-animating' : 'ant-click-animating-without-extra-node'
    },

    resetEffect (node) {
      if (!node || node === this.extraNode) {
        return
      }
      const { insertExtraNode } = this.$props
      const attributeName = this.getAttributeName()
      node.removeAttribute(attributeName)
      this.removeExtraStyleNode()
      if (insertExtraNode && this.extraNode && node.contains(this.extraNode)) {
        node.removeChild(this.extraNode)
      }
      TransitionEvents.removeEndEventListener(node, this.onTransitionEnd)
    },

    onTransitionEnd (e) {
      if (!e || e.animationName !== 'fadeEffect') {
        return
      }
      this.resetEffect(e.target)
    },
    removeExtraStyleNode () {
      if (this.styleForPesudo && document.body.contains(this.styleForPesudo)) {
        document.body.removeChild(this.styleForPesudo)
        this.styleForPesudo = null
      }
    },
  },

  render () {
    return this.$slots.default && this.$slots.default[0]
  },
}
