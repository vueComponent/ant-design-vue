<cn>
#### 自定义面板
自定义各个面板的背景色、圆角、边距和图标。
</cn>

<us>
#### Custom Panel
Customize the background, border and margin styles and icon for each panel.
</us>

```tpl
<template>
  <div>
    <a-collapse defaultActiveKey="1" :bordered="false">
      <template v-slot:expandIcon="props">
        <a-icon type="caret-right" :rotate="props.isActive ? 90 : 0" />
      </template>
      <a-collapse-panel header="This is panel header 1" key="1" :style="customStyle">
        <p>{{text}}</p>
      </a-collapse-panel>
      <a-collapse-panel header="This is panel header 2" key="2" :style="customStyle">
        <p>{{text}}</p>
      </a-collapse-panel>
      <a-collapse-panel header="This is panel header 3" key="3" :style="customStyle">
        <p>{{text}}</p>
      </a-collapse-panel>
    </a-collapse>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        text: `A dog is a type of domesticated animal.Known for its loyalty and faithfulness,it can be found as a welcome guest in many households across the world.`,
        customStyle:
          'background: #f7f7f7;border-radius: 4px;margin-bottom: 24px;border: 0;overflow: hidden',
      };
    },
  };
</script>
```
