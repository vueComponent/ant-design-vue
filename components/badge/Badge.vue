<template>
  <span :class="badgeComputedCls.badgeCls">
    <template v-if="isStatusBadge">
      <span :class="badgeComputedCls.statusCls"></span>
      <span :class="[prefixCls+'-status-text']">{{text}}</span>
    </template>
    <template v-else>
      <slot></slot>
      <scroll-number
        v-if="!badgeStatus.isHidden"
        :prefixCls="scrollNumberPrefixCls"
        :className="badgeComputedCls.scrollNumberCls"
        :count="badgeStatus.stateCount"
        :titleNumber="count"
        :styleNumber="styles"
        >
      </scroll-number>
      <span
        v-if="!badgeStatus.isHidden && text"
        :class="[prefixCls+'-status-text']">
        {{text}}
      </span>
    </template>
  </span>
</template>
<script>
import Icon from '../icon'
import ScrollNumber from './ScrollNumber'

export default {
  name: 'Badge',
  props: {
    prefixCls: {
      type: String,
      default: 'ant-badge',
    },
    scrollNumberPrefixCls: {
      type: String,
      default: 'ant-scroll-number',
    },
    count: {
      type: [Number, String],
    },
    overflowCount: {
      type: [Number, String],
      default: 99,
    },
    showZero: {
      type: Boolean,
      default: false,
    },
    dot: {
      type: Boolean,
      default: false,
    },
    status: {
      validator: (val) => {
        if (!val) return true
        return ['success', 'processing', 'default', 'error', 'warning'].includes(val)
      },
      default: '',
    },
    text: {
      type: String,
      default: '',
    },
    styles: {
      type: Object,
      default: () => ({}),
    },
  },
  data () {
    return {
      isHasDefaultSlot: this.$slots && !!this.$slots.default,
    }
  },
  computed: {
    isStatusBadge () {
      const { isHasDefaultSlot, status } = this
      return !isHasDefaultSlot && status
    },
    badgeComputedCls () {
      const { prefixCls, isHasDefaultSlot, status, dot } = this
      const isDot = dot || status
      return {
        badgeCls: {
          [`${prefixCls}`]: true,
          [`${prefixCls}-status`]: !!status,
          [`${prefixCls}-not-a-wrapper`]: !isHasDefaultSlot,
        },
        statusCls: {
          [`${prefixCls}-status-dot`]: !!status,
          [`${prefixCls}-status-${status}`]: !isHasDefaultSlot,
        },
        scrollNumberCls: {
          [`${prefixCls}-dot`]: isDot,
          [`${prefixCls}-count`]: !isDot,
        },
      }
    },
    badgeStatus () {
      const { count, overflowCount, showZero, dot, text, status } = this
      let stateCount = +count > +overflowCount ? `${overflowCount}+` : count
      const isDot = dot || text
      if (isDot) {
        stateCount = ''
      }
      const isZero = stateCount === '0' || stateCount === 0
      const isEmpty = stateCount === null || stateCount === undefined || stateCount === ''
      const isHidden = (isEmpty || (isZero && !showZero)) && !isDot
      return {
        stateCount,
        isHidden,
      }
    },
  },
  methods: {

  },
  components: {
    Icon,
    ScrollNumber,
  },
}
</script>
