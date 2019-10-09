<cn>
#### 响应式布局
参照 Bootstrap 的 [响应式设计](http://getbootstrap.com/css/#grid-media-queries)，预设六个响应尺寸：`xs` `sm` `md` `lg` `xl`  `xxl`。
</cn>

<us>
#### 响应式布局
Referring to the Bootstrap [responsive design] (http://getbootstrap.com/css/#grid-media-queries), here preset six dimensions: `xs` `sm` `md` `lg` `xl`.
</us>

```tpl
<template>
  <a-row>
    <a-col :xs="2" :sm="4" :md="6" :lg="8" :xl="10">Col</a-col>
    <a-col :xs="20" :sm="16" :md="12" :lg="8" :xl="4">Col</a-col>
    <a-col :xs="2" :sm="4" :md="6" :lg="8" :xl="10">Col</a-col>
  </a-row>
</template>
```
