<cn>
#### 基本用法
基本标签的用法，可以通过添加 `closable` 变为可关闭标签。可关闭标签具有 `onClose` `afterClose` 两个事件。
</cn>

<us>
#### basic Usage
Usage of basic Tag, and it could be closable by set `closable` property. Closable Tag supports `onClose` `afterClose` events.
</us>

```tpl
<template>
  <div>
    <a-tag>Tag 1</a-tag>
    <a-tag><a href="https://github.com/vueComponent/ant-design">Link</a></a-tag>
    <a-tag closable @close="log">Tag 2</a-tag>
    <a-tag closable @close="preventDefault">Prevent Default</a-tag>
  </div>
</template>
<script>
  export default {
    methods: {
      log(e) {
        console.log(e);
      },
      preventDefault(e) {
        e.preventDefault();
        console.log('Clicked! But prevent default.');
      },
    },
  };
</script>
```
