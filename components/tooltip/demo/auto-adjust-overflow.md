<cn>
#### 自动调整位置
气泡框不可见时自动调整位置
</cn>

<us>
#### Adjust placement automatically
Adjust popup placement automatically when popup is invisible
</us>

```tpl
<template>
  <div :style="wrapStyles">
    <a-tooltip placement="left" title="Prompt Text" :getPopupContainer="getPopupContainer">
      <a-button>Adjust automatically / 自动调整</a-button>
    </a-tooltip>
    <br />
    <a-tooltip
      style="marginTop: 10px"
      placement="left"
      title="Prompt Text"
      :getPopupContainer="getPopupContainer"
      :autoAdjustOverflow="false"
    >
      <a-button>Ingore / 不处理</a-button>
    </a-tooltip>
  </div>
</template>
<script>
  const wrapStyles = {
    overflow: 'hidden',
    position: 'relative',
    padding: '24px',
    border: '1px solid #e9e9e9',
  };
  export default {
    data() {
      return {
        wrapStyles,
      };
    },
    methods: {
      getPopupContainer(trigger) {
        return trigger.parentElement;
      },
    },
  };
</script>
```
