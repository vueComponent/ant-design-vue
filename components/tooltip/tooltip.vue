<script>
import Vue from 'vue'
export default {
  name: 'ToolTip',
  props: {
    title: String,
    prefixCls: {
      default: 'ant-tooltip',
    },
    placement: {
      default: 'top',
      validator: val => ['top', 'left', 'right', 'bottom', 'topLeft', 'topRight', 'bottomLeft', 'bottomRight', 'leftTop', 'leftBottom', 'rightTop', 'rightBottom'].includes(val)
    },
    transitionName: {
      default: 'zoom-big-fast',
    },
    mouseEnterDelay: {
      default: 0.1,
    },
    mouseLeaveDelay: {
      default: 0.1,
    },
    arrowPointAtCenter: {
      default: false,
    },
    autoAdjustOverflow: {
      default: true,
    },
  },
  data () {
    return {
      vnode: null,
      visible: false,
      left: 0,
      top: 0,
      realPlacement: this.placement,
      t1: null,
      t2: null,
    }
  },
  computed: {
    classes () {
      const { prefixCls } = this
      return {
        [`${prefixCls}`]: true,
      }
    },
  },
  methods: {
    checkPosition(popup, text, placement) {
      let { top, left, bottom, right } = text
      const reg = /(top|bottom|left|right)(.*)/
      const [, abstractPos, suffix] = placement.match(reg)
      let ret = placement
      // we can change the position many times
      if (abstractPos === 'left' && left < popup.width) ret = 'right' + suffix
      if (abstractPos === 'right' && document.documentElement.clientWidth - right < popup.width) ret = 'left' + suffix
      if (abstractPos === 'top' && top < popup.height) ret = 'bottom' + suffix
      if (abstractPos === 'bottom' && document.documentElement.clientHeight - bottom < popup.height) ret = 'left' + suffix
      return ret
    },
    mountNode(callback) {
      if (this.vnode) {
        callback()
        return
      }
      const div = document.createElement('div')
      document.body.appendChild(div)
      const that = this
      const vnode = new Vue({
        data() {
          return {
            left: 0,
            top: 0,
          }
        },
        methods: {
          hideSelf(e) {
            if (that.t1) {
              clearTimeout(that.t1)
              that.t1 = null
            }
            if (that.mouseLeaveDelay) {
              that.t2 = window.setTimeout(() => {
                if (e.relatedTarget === that.$el) {
                  return
                }
                that.visible = false
              }, +that.mouseLeaveDelay * 1e3)
            }
          }
        },
        render(h) {
          return (
            <transition name={that.transitionName}>
              <div
                v-show={that.visible}
                class={`ant-tooltip ant-tooltip-placement-${that.realPlacement}`}
                style={{ left: this.left + 'px', top: this.top + 'px' }}
                onMouseleave={this.hideSelf}
              >
                <div class="ant-tooltip-content">
                  <div class="ant-tooltip-arrow"/>
                  <div class="ant-tooltip-inner">
                    <span>{that.title}</span>
                  </div>
                </div>
              </div>
            </transition>
          )
        }
      }).$mount(div)
      this.$nextTick(() => {
        this.vnode = vnode
        callback()
      })
    },
    onPopupAlign: (placement, domNode, target, align) => {
      if (!placement) {
        return
      }
      // 根据当前坐标设置动画点
      const rect = domNode.getBoundingClientRect()
      const transformOrigin = {
        top: '50%',
        left: '50%',
      }
      if (placement.indexOf('top') >= 0 || placement.indexOf('Bottom') >= 0) {
        transformOrigin.top = `${rect.height - align.offset[1]}px`
      } else if (placement.indexOf('Top') >= 0 || placement.indexOf('bottom') >= 0) {
        transformOrigin.top = `${-align.offset[1]}px`
      }
      if (placement.indexOf('left') >= 0 || placement.indexOf('Right') >= 0) {
        transformOrigin.left = `${rect.width - align.offset[0]}px`
      } else if (placement.indexOf('right') >= 0 || placement.indexOf('Left') >= 0) {
        transformOrigin.left = `${-align.offset[0]}px`
      }
      target.style.transformOrigin = `${transformOrigin.left} ${transformOrigin.top}`
    },
    addEventHandle(old, fn) {
      if (!old) {
        return fn
      } else if (Array.isArray(old)) {
        return old.indexOf(fn) > -1 ? old : old.concat(fn)
      } else {
        return old === fn ? old : [old, fn]
      }
    },
    computeOffset(popup, text, placement, scale) {
      let { width, height, top, left } = text
      //  you cant change the properties of DOMRect
      top += window.scrollY
      left += window.scrollX
      // FIXME: we can get the numbers from scale, but that's not what we really want
      const p = { width: popup.width / scale, height: popup.height / scale }
      const ret = { left, top }

      if (/top/.test(placement)) ret.top -= p.height
      if (/bottom/.test(placement)) ret.top += height
      if (/left/.test(placement)) ret.left -= p.width
      if (/right/.test(placement)) ret.left += width

      // FIXME: magic number 20 & 14 comes from the offset of triangle
      if (/Left/.test(placement)) {
        if (this.arrowPointAtCenter) ret.left += width / 2 - 20
      } else if(/Right/.test(placement)) {
        ret.left += (width - p.width)
        if (this.arrowPointAtCenter) ret.left -= width / 2 - 20
      } else if(/(top)|(bottom)/.test(placement)) {
        ret.left += (width - p.width) / 2
      }
      if (/Top/.test(placement)) {
        if (this.arrowPointAtCenter) ret.top += height / 2 - 14
      } else if(/Bottom/.test(placement)) {
        ret.top += (height - p.height)
        if (this.arrowPointAtCenter) ret.top -= height / 2 - 14
      } else if(/(left)|(right)/.test(placement)) {
        ret.top += (height - p.height) / 2
      }
      return ret
    },
    showNode() {
      this.mountNode(() => {
        this.visible = true
        this.$nextTick(() => {
          const popup = this.vnode.$el.getBoundingClientRect()
          const [, scale = 1] = window.getComputedStyle(this.vnode.$el).transform.match(/matrix\((.*?),/) || []
          const content = this.$el.getBoundingClientRect()
          const place = this.autoAdjustOverflow ? this.checkPosition(popup, content, this.placement, scale) : this.placement
          this.realPlacement = place
          const { left, top } = this.computeOffset(popup, content, place, scale)
          this.vnode.left = left
          this.vnode.top = top
        })
        this.onPopupAlign(this.realPlacement, this.$el, this.vnode.$el, { offset: [0,0] })
      })
    },
    hideNode(e) {
      if (!this.vnode) return
      if (e.relatedTarget === this.vnode.$el) {
        return
      }
      this.visible = false
    },
    checkShow(e) {
      if (this.t2) {
        clearTimeout(this.t2)
        this.t2 = null
      }
      if (this.mouseEnterDelay) {
        this.t1 = window.setTimeout(() => {
          this.showNode(e)
        }, +this.mouseEnterDelay * 1e3)
      }
    },
    checkHide(e) {
      if (this.t1) {
        clearTimeout(this.t1)
        this.t1 = null
      }
      if (this.mouseLeaveDelay) {
        this.t2 = window.setTimeout(() => {
          this.hideNode(e)
        }, +this.mouseLeaveDelay * 1e3)
      }
    }
  },
  render(h) {
    const inner = this.$slots.default[0]
    inner.data = inner.data || {}
    inner.data.on = inner.data.on || {}
    inner.data.on.mouseenter = this.addEventHandle(inner.data.on.mouseenter, this.checkShow)
    inner.data.on.mouseleave = this.addEventHandle(inner.data.on.mouseleave, this.checkHide)

    return this.$slots.default[0]
  },
  updated() {
    if (!this.vnode) return
    const popup = this.vnode.$el.getBoundingClientRect()
    const [, scale = 1] = window.getComputedStyle(this.vnode.$el).transform.match(/matrix\((.*?),/) || []
    const content = this.$el.getBoundingClientRect()
    const { left, top } = this.computeOffset(popup, content, this.realPlacement, scale)
    this.vnode.left = left
    this.vnode.top = top
  },
  beforeDestroy() {
    if (!this.vnode) return
    this.vnode.$el.remove()
    this.vnode.$destroy()
  }
}
</script>
