<cn>
#### 延迟
延迟显示 loading 效果。当 spinning 状态在 `delay` 时间内结束，则不显示 loading 状态。
</cn>

<us>
#### delay
Specifies a delay for loading state. If `spinning` ends during delay, loading status won't appear.
</us>

```tpl
<style scoped>
  .spin-content {
    border: 1px solid #91d5ff;
    background-color: #e6f7ff;
    padding: 30px;
  }
</style>
<template>
  <div>
    <a-spin :spinning="spinning" :delay="delayTime">
      <div class="spin-content">
        可以点击‘切换’按钮，延迟显示 loading 效果。当 spinning 状态在 `delay` 时间内结束，则不显示
        loading 状态。
      </div>
    </a-spin>
    Loading state：<a-switch v-model="spinning"></a-switch>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        spinning: false,
        delayTime: 500,
      };
    },
    methods: {
      changeSpinning() {
        this.spinning = !this.spinning;
      },
    },
  };
</script>
```
