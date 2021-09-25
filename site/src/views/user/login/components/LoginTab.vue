<template>
  <a-tab-pane v-bind="$props">
    <slot />
  </a-tab-pane>
</template>
<script>
const generateId = (() => {
  let i = 0;
  return (prefix = '') => {
    i += 1;
    return `${prefix}${i}`;
  };
})();

export default {
  typeName: 'LoginTab',
  inject: {
    loginContext: { default: () => ({ tabUtil: {} }) },
  }, // 标志位 用来判断是不是自定义组件
  props: {
    active: Boolean,
    destroyInactiveTabPane: Boolean,
    rootPrefixCls: String,
    tab: String,
  },
  data() {
    return {
      uniqueId: generateId('login-tab-'),
    };
  },
  mounted() {
    if (this.loginContext.tabUtil && this.loginContext.tabUtil.addTab) {
      this.loginContext.tabUtil.addTab(this.uniqueId);
    }
  },
};
</script>
