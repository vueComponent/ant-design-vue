<cn>
#### 导航步骤
导航类型的步骤条。
</cn>

<us>
#### Navigation Steps
Navigation steps.
</us>

```tpl
<template>
  <div>
    <a-steps
      type="navigation"
      size="small"
      v-model="current"
      :style="stepStyle"
    >
      <a-step
        title="Step 1"
        subTitle="00:00:05"
        status="finish"
        description="This is a description."
      />
      <a-step
        title="Step 2"
        subTitle="00:01:02"
        status="process"
        description="This is a description."
      />
      <a-step
        title="Step 3"
        subTitle="waiting for longlong time"
        status="wait"
        description="This is a description."
      />
    </a-steps>
    <a-steps type="navigation" v-model="current" :style="stepStyle">
      <a-step status="finish" title="Step 1" />
      <a-step status="process" title="Step 2" />
      <a-step status="wait" title="Step 3" />
      <a-step status="wait" title="Step 4" />
    </a-steps>
    <a-steps
      type="navigation"
      size="small"
      v-model="current"
      :style="stepStyle"
    >
      <a-step status="finish" title="finish 1" />
      <a-step status="finish" title="finish 2" />
      <a-step status="process" title="current process" />
      <a-step status="wait" title="wait" disabled />
    </a-steps>
  </div>
</template>
<script>
export default {
  data() {
    return {
      current: 0,
      stepStyle: {
        marginBottom: '60px',
        boxShadow: '0px -1px 0 0 #e8e8e8 inset',
      }
    }
  }
}
</script>
```
