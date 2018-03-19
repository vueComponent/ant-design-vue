
import Vue from 'vue'
import PropTypes from '../_util/vue-types'
import { getStyle } from '../_util/props-util'
import BaseMixin from '../_util/BaseMixin'
import createChainedFunction from '../_util/createChainedFunction'
import getTransitionProps from '../_util/getTransitionProps'
import Notice from './Notice'

let seed = 0
const now = Date.now()

function getUuid () {
  return `rcNotification_${now}_${seed++}`
}

const Notification = {
  mixins: [BaseMixin],
  props: {
    prefixCls: PropTypes.string.def('rc-notification'),
    transitionName: PropTypes.string,
    animation: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).def('fade'),
  },
  data () {
    return {
      notices: [],
    }
  },
  methods: {
    getTransitionName () {
      const props = this.$props
      let transitionName = props.transitionName
      if (!transitionName && props.animation) {
        transitionName = `${props.prefixCls}-${props.animation}`
      }
      return transitionName
    },

    add (notice) {
      const key = notice.key = notice.key || getUuid()
      this.setState(previousState => {
        const notices = previousState.notices
        if (!notices.filter(v => v.key === key).length) {
          return {
            notices: notices.concat(notice),
          }
        }
      })
    },

    remove (key) {
      this.setState(previousState => {
        return {
          notices: previousState.notices.filter(notice => notice.key !== key),
        }
      })
    },
  },

  render (h) {
    const { prefixCls, notices, remove, getTransitionName } = this
    const transitionProps = getTransitionProps(getTransitionName())
    const noticeNodes = notices.map((notice) => {
      const { content, duration, closable, onClose, key, style, class: className } = notice
      const close = createChainedFunction(remove.bind(this, key), onClose)
      const noticeProps = {
        props: {
          prefixCls,
          duration,
          closable,
        },
        on: {
          close,
        },
        style,
        class: className,
        key,
      }
      return (
        <Notice
          {...noticeProps}
        >
          {content(h)}
        </Notice>
      )
    })
    const className = {
      [prefixCls]: 1,
    }
    const style = getStyle(this)
    return (
      <div class={className} style={style || {
        top: '65px',
        left: '50%',
      }}>
        <transition-group {...transitionProps}>{noticeNodes}</transition-group>
      </div>
    )
  },
}

Notification.newInstance = function newNotificationInstance (properties, callback) {
  const { getContainer, style, class: className, ...props } = properties || {}
  const div = document.createElement('div')
  if (getContainer) {
    const root = getContainer()
    root.appendChild(div)
  } else {
    document.body.appendChild(div)
  }
  new Vue({
    el: div,
    mounted () {
      const self = this
      this.$nextTick(() => {
        callback({
          notice (noticeProps) {
            self.$refs.notification.add(noticeProps)
          },
          removeNotice (key) {
            self.$refs.notification.remove(key)
          },
          component: self,
          destroy () {
            self.$destroy()
            self.$el.parentNode.removeChild(self.$el)
          },
        })
      })
    },
    render () {
      const p = {
        props,
        ref: 'notification',
        style,
        class: className,
      }
      return (
        <Notification
          {...p}
        />
      )
    },
  })
}

export default Notification


