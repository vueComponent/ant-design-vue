<cn>
#### Flex 对齐
Flex 子元素垂直对齐。
</cn>

<us>
#### Flex Alignment
Flex child elements vertically aligned.
</us>

```tpl
<template>
  <div>
    <p>Align Top</p>
    <a-row type="flex" justify="center" align="top">
      <a-col :span="4"><p class="height-100">col-4</p></a-col>
      <a-col :span="4"><p class="height-50">col-4</p></a-col>
      <a-col :span="4"><p class="height-120">col-4</p></a-col>
      <a-col :span="4"><p class="height-80">col-4</p></a-col>
    </a-row>

    <p>Align Center</p>
    <a-row type="flex" justify="space-around" align="middle">
      <a-col :span="4"><p class="height-100">col-4</p></a-col>
      <a-col :span="4"><p class="height-50">col-4</p></a-col>
      <a-col :span="4"><p class="height-120">col-4</p></a-col>
      <a-col :span="4"><p class="height-80">col-4</p></a-col>
    </a-row>

    <p>Align Bottom</p>
    <a-row type="flex" justify="space-between" align="bottom">
      <a-col :span="4"><p class="height-100">col-4</p></a-col>
      <a-col :span="4"><p class="height-50">col-4</p></a-col>
      <a-col :span="4"><p class="height-120">col-4</p></a-col>
      <a-col :span="4"><p class="height-80">col-4</p></a-col>
    </a-row>
  </div>
</template>
```
