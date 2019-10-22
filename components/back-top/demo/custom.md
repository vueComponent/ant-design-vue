<cn>
#### 自定义样式
可以自定义回到顶部按钮的样式，限制宽高：`40px * 40px`。
</cn>

<us>
#### Custom style
You can customize the style of the button, just note the size limit: no more than `40px * 40px`.
</us>

```tpl
<template>
  <div id="components-back-top-demo-custom">
    <a-back-top>
      <div class="ant-back-top-inner">UP</div>
    </a-back-top>
    Scroll down to see the bottom-right
    <strong style="color: #1088e9"> blue </strong>
    button.
  </div>
</template>
<style scoped>
  #components-back-top-demo-custom .ant-back-top {
    bottom: 100px;
  }
  #components-back-top-demo-custom .ant-back-top-inner {
    height: 40px;
    width: 40px;
    line-height: 40px;
    border-radius: 4px;
    background-color: #1088e9;
    color: #fff;
    text-align: center;
    font-size: 20px;
  }
</style>
```
