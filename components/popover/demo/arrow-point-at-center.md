<cn>
#### 箭头指向
设置了 `arrowPointAtCenter` 后，箭头将指向目标元素的中心。
</cn>

<us>
#### Arrow pointing
The arrow points to the center of the target element, which set `arrowPointAtCenter`.
</us>

```tpl
<template>
  <div>
    <a-popover placement="topLeft">
      <template slot="content">
        <p>Content</p>
        <p>Content</p>
      </template>
      <span slot="title">Title</span>
      <a-button>Align edge / 边缘对齐</a-button>
    </a-popover>
    <a-popover placement="topLeft" arrowPointAtCenter>
      <template slot="content">
        <p>Content</p>
        <p>Content</p>
      </template>
      <span slot="title">Title</span>
      <a-button>Arrow points to center / 箭头指向中心</a-button>
    </a-popover>
  </div>
</template>
```
