<cn>
#### 文本域
用于多行输入。
</cn>

<us>
#### TextArea
For multi-line input.
</us>

```tpl
<template>
  <div>
    <a-button style="margin-bottom: 16px" @click="() => this.autoResize = !autoResize">
      Auto Resize: {String(autoResize)}
    </a-button>
    <a-textarea :rows="4" :autosize="autoResize" :defaultValue="defaultValue" />
  </div>
</template>
<script>
  export default {
    data: () => ({
      autoResize: false,
      defaultValue:
        'autosize 属性适用于 textarea 节点，并且只有高度会自动变化。另外 autosize 可以设定为一个对象，指定最小行数和最大行数。autosize 属性适用于 textarea 节点，并且只有高度会自动变化。另外 autosize 可以设定为一个对象，指定最小行数和最大行数。autosize 属性适用于 textarea 节点，并且只有高度会自动变化。另外 autosize 可以设定为一个对象，指定最小行数和最大行数。autosize 属性适用于 textarea 节点，并且只有高度会自动变化。另外 autosize 可以设定为一个对象，指定最小行数和最大行数。autosize 属性适用于 textarea 节点，并且只有高度会自动变化。另外 autosize 可以设定为一个对象，指定最小行数和最大行数。autosize 属性适用于 textarea 节点，并且只有高度会自动变化。另外 autosize 可以设定为一个对象，指定最小行数和最大行数。autosize 属性适用于 textarea 节点，并且只有高度会自动变化。另外 autosize 可以设定为一个对象，指定最小行数和最大行数。ending',
    }),
  };
</script>
```
