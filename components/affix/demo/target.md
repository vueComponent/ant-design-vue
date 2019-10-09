<cn>
#### 滚动容器
用 `target` 设置 `Affix` 需要监听其滚动事件的元素，默认为 `window`。
</cn>

<us>
#### Container to scroll.
Set a `target` for 'Affix', which is listen to scroll event of target element (default is `window`).
</us>

```tpl
<template>
  <div id="components-affix-demo-target" class="scrollable-container" ref="container">
    <div class="background">
      <a-affix :target="() => this.$refs.container">
        <a-button type="primary">
          Fixed at the top of container
        </a-button>
      </a-affix>
    </div>
  </div>
</template>
<style>
  #components-affix-demo-target.scrollable-container {
    height: 100px;
    overflow-y: scroll;
  }
  #components-affix-demo-target .background {
    padding-top: 60px;
    height: 300px;
    background-image: url('https://zos.alipayobjects.com/rmsportal/RmjwQiJorKyobvI.jpg');
  }
</style>
```
