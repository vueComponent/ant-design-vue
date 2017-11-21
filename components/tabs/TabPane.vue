<template>
  <div
    role="tabpanel"
    :aria-hidden="active ? 'false' : 'true'"
    :class="classes"
  >
    <slot v-if="isRender || forceRender">
    </slot>
  </div>
</template>
<script>
export default {
  name: 'TabPane',
  props: {
    pKey: [String, Number],
    forceRender: Boolean,
    // placeholder: [Function, String, Number],
  },
  data () {
    const { prefixCls, destroyInactiveTabPane, activeKey } = this.$parent
    return {
      rootPrefixCls: prefixCls,
      destroyInactiveTabPane,
      active: this.pKey === activeKey,
    }
  },
  computed: {
    classes () {
      const { rootPrefixCls, active } = this
      const prefixCls = `${rootPrefixCls}-tabpane`
      return {
        [`${prefixCls}`]: true,
        [`${prefixCls}-inactive`]: !active,
        [`${prefixCls}-active`]: active,
      }
    },
    isRender () {
      const {
        destroyInactiveTabPane, active,
      } = this
      this._isActived = this._isActived || active
      return destroyInactiveTabPane ? active : this._isActived
    },
  },
  methods: {
  },
}
</script>
