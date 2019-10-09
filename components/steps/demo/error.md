<cn>
#### 步骤运行错误
使用 Steps 的 `status` 属性来指定当前步骤的状态。
</cn>

<us>
#### Error status
By using `status` of `Steps`, you can specify the state for current step.
</us>

```tpl
<template>
  <a-steps :current="1" status="error">
    <a-step title="Finished" description="This is a description." />
    <a-step title="In Progress" description="This is a description." />
    <a-step title="Waiting" description="This is a description." />
  </a-steps>
</template>
```
