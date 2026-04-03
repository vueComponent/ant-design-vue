<template>
  <a-result
    status="error"
    title="Submission Failed"
    sub-title="Please check and modify the following information before resubmitting."
  >
    <template #extra>
      <a-button key="console" type="primary">Go Console</a-button>
      <a-button key="buy">Buy Again</a-button>
    </template>

    <div class="desc">
      <p class="ant-result-demo-error-heading">
        <strong>The content you submitted has the following error:</strong>
      </p>
      <p class="ant-result-demo-error-item">
        <span class="ant-result-demo-error-icon" aria-hidden="true">!</span>
        Your account has been frozen
        <a class="ant-result-demo-link" href="https://www.antdv.com/" target="_blank" rel="noreferrer">
          Thaw immediately &gt;
        </a>
      </p>
      <p class="ant-result-demo-error-item">
        <span class="ant-result-demo-error-icon" aria-hidden="true">!</span>
        Your account is not yet eligible to apply
        <a class="ant-result-demo-link" href="https://www.antdv.com/" target="_blank" rel="noreferrer">
          Apply Unlock &gt;
        </a>
      </p>
    </div>
  </a-result>
</template>

<style scoped>
.ant-result-demo-error-heading {
  margin-bottom: 16px;
  font-size: 16px;
}
.ant-result-demo-error-item {
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  gap: 8px;
}
.ant-result-demo-error-icon {
  display: inline-flex;
  height: 20px;
  width: 20px;
  align-items: center;
  justify-content: center;
  border-radius: 9999px;
  font-size: 12px;
  font-weight: 600;
  color: #fff;
  background-color: var(--color-error, #ff4d4f);
}
.ant-result-demo-link {
  color: var(--color-accent, #1677ff);
}
</style>
