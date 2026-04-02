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
