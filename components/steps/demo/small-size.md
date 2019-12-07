<cn>
#### 迷你版
迷你版的步骤条，通过设置 `<Steps size="small">` 启用。
</cn>

<us>
#### Mini version
By setting like this: `<Steps size="small">`, you can get a mini version.
</us>

```tpl
<template>
  <a-steps :current="1" size="small">
    <a-step title="Finished" />
    <a-step title="In Progress" />
    <a-step title="Waiting" />
  </a-steps>
</template>
```
