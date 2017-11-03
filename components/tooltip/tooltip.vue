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
      console.info(right - left, popup.width)
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
        render(h) {
          return (
            <transition name="zoom-big">
              <div
                v-show={that.visible}
                class={`ant-tooltip ant-tooltip-placement-${that.realPlacement}`}
                style={{ left: this.left + 'px', top: this.top + 'px' }}
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
        return;
      }
      // 根据当前坐标设置动画点
      const rect = domNode.getBoundingClientRect()
      const transformOrigin = {
        top: '50%',
        left: '50%',
      };
      if (placement.indexOf('top') >= 0 || placement.indexOf('Bottom') >= 0) {
        transformOrigin.top = `${rect.height - align.offset[1]}px`;
      } else if (placement.indexOf('Top') >= 0 || placement.indexOf('bottom') >= 0) {
        transformOrigin.top = `${-align.offset[1]}px`;
      }
      if (placement.indexOf('left') >= 0 || placement.indexOf('Right') >= 0) {
        transformOrigin.left = `${rect.width - align.offset[0]}px`;
      } else if (placement.indexOf('right') >= 0 || placement.indexOf('Left') >= 0) {
        transformOrigin.left = `${-align.offset[0]}px`;
      }
      target.style.transformOrigin = `${transformOrigin.left} ${transformOrigin.top}`;
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
    computeOffset(popup, text, placement) {
      let { width, height, top, left } = text
      //  you cant change the properties of DOMRect
      top += window.scrollY
      left += window.scrollX
      const ret = { left, top }

      if (/top/.test(placement)) ret.top -= popup.height + 5
      if (/bottom/.test(placement)) ret.top += height + 5
      if (/left/.test(placement)) ret.left -= popup.width + 10
      if (/right/.test(placement)) ret.left += width + 5

      if (/Left/.test(placement)) {
      } else if(/Right/.test(placement)) {
        ret.left += (width - popup.width)
      } else if(/(top)|(bottom)/.test(placement)) {
        ret.left += (width - popup.width) / 2
      }
      if (/Top/.test(placement)) {
      } else if(/Bottom/.test(placement)) {
        ret.top += (height - popup.height)
      } else if(/(left)|(right)/.test(placement)) {
        ret.top += (height - popup.height) / 2
      }
      return ret
    },
    showNode() {
      this.mountNode(() => {
        this.visible = true
        this.$nextTick(() => {
          const popup = this.vnode.$el.getBoundingClientRect()
          const content = this.$el.getBoundingClientRect()
          const place = this.checkPosition(popup, content, this.placement)
          this.realPlacement = place
          const { left, top } = this.computeOffset(popup, content, place)
          this.vnode.left = left
          this.vnode.top = top
        })
        this.onPopupAlign(this.realPlacement, this.$el, this.vnode.$el, { offset: [0,0] })
      })
    },
    hideNode() {
      this.visible = false
    }
  },
  render(h) {
    const inner = this.$slots.default[0]
    inner.data = inner.data || {}
    inner.data.on = inner.data.on || {}
    inner.data.on.mouseenter = this.addEventHandle(inner.data.on.mouseenter, this.showNode)
    inner.data.on.mouseleave = this.addEventHandle(inner.data.on.mouseleave, this.hideNode)

    return this.$slots.default[0]
  },
  updated() {
    if (!this.vnode) return
    const popup = this.vnode.$el.getBoundingClientRect()
    const content = this.$el.getBoundingClientRect()
    const { left, top } = this.computeOffset(popup, content, this.realPlacement)
    this.vnode.left = left
    this.vnode.top = top
  },
  beforeDestroy() {
    if (!this.vnode) return
    this.vnode.$el.remove()
    this.vnode.$destroy();
  }
}
</script>
