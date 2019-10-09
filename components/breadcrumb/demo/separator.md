<cn>
  #### 分隔符
  使用` separator=">" `可以自定义分隔符，或者使用slot="separator"自定义更复杂的分隔符
</cn>

<us>
  #### Configuring the Separator
  The separator can be customized by setting the separator preperty: separator=">" or use 
  slot="separator"
</us>

```tpl
<template>
  <div>
    <a-breadcrumb separator=">">
      <a-breadcrumb-item>Home</a-breadcrumb-item>
      <a-breadcrumb-item href="">Application Center</a-breadcrumb-item>
      <a-breadcrumb-item href="">Application List</a-breadcrumb-item>
      <a-breadcrumb-item>An Application</a-breadcrumb-item>
    </a-breadcrumb>
    <a-breadcrumb>
      <span slot="separator" style="color: red">></span>
      <a-breadcrumb-item>Home</a-breadcrumb-item>
      <a-breadcrumb-item href="">Application Center</a-breadcrumb-item>
      <a-breadcrumb-item href="">Application List</a-breadcrumb-item>
      <a-breadcrumb-item>An Application</a-breadcrumb-item>
    </a-breadcrumb>
  </div>
</template>
```
