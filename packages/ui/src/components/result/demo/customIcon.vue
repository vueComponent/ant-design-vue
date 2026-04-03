<template>
  <a-result title="Great, we have done all the operations!">
    <template #icon>
      <span class="ant-result-demo-custom-icon" aria-hidden="true">OK</span>
    </template>
    <template #extra>
      <a-button type="primary">Next</a-button>
    </template>
  </a-result>
</template>

<style scoped>
.ant-result-demo-custom-icon {
  display: inline-flex;
  height: 72px;
  width: 72px;
  align-items: center;
  justify-content: center;
  border-radius: 9999px;
  font-size: 24px;
  font-weight: 600;
  color: #fff;
  background: radial-gradient(circle at top, var(--color-accent-hover, #4096ff), var(--color-accent, #1677ff));
}
</style>
