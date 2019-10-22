<cn>
#### 基本用法
简单的步骤条。
</cn>

<us>
#### Basic
The most basic step bar.
</us>

```tpl
<template>
  <a-steps :current="1">
    <a-step>
      <!-- <span slot="title">Finished</span> -->
      <template slot="title">
        Finished
      </template>
      <span slot="description">This is a description.</span>
    </a-step>
    <a-step title="In Progress" description="This is a description." />
    <a-step title="Waiting" description="This is a description." />
  </a-steps>
</template>
```
