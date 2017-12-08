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
    tab: [String, Number, Function],
    disabled: Boolean,
    closable: Boolean,
    forceRender: Boolean,
  },
  data () {
    return {
    }
  },
  computed: {
    classes () {
      const { $parent, active } = this
      const prefixCls = `${$parent.prefixCls}-tabpane`
      return {
        [`${prefixCls}`]: true,
        [`${prefixCls}-inactive`]: !active,
        [`${prefixCls}-active`]: active,
      }
    },
    active () {
      const { activeKey } = this.$parent
      return activeKey === this.$vnode.key
    },
    isRender () {
      const {
        active,
        $parent,
      } = this
      const destroyInactiveTabPane = $parent.destroyInactiveTabPane
      this._isActived = this._isActived || active
      return destroyInactiveTabPane ? active : this._isActived
    },
  },
  methods: {
  },
}
</script>
