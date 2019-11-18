<cn>
#### 三种触发方式
鼠标移入、聚集、点击。
</cn>

<us>
#### Three ways to trigger
Mouse to click, focus and move in.
</us>

```tpl
<template>
  <div>
    <a-popover title="Title" trigger="hover">
      <template slot="content">
        <p>Content</p>
        <p>Content</p>
      </template>
      <a-button type="primary">Hover me</a-button>
    </a-popover>
    <a-popover title="Title" trigger="focus">
      <template slot="content">
        <p>Content</p>
        <p>Content</p>
      </template>
      <a-button type="primary">Focus me</a-button>
    </a-popover>
    <a-popover title="Title" trigger="click">
      <template slot="content">
        <p>Content</p>
        <p>Content</p>
      </template>
      <a-button type="primary">Click me</a-button>
    </a-popover>
  </div>
</template>
```
