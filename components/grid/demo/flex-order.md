<cn>
#### Flex 排序
从堆叠到水平排列。
通过 Flex 布局的 Order 来改变元素的排序。
</cn>

<us>
#### Flex Order
To change the element sort by Flex layout order.
</us>

```tpl
<template>
  <div>
    <a-row type="flex">
      <a-col :span="6" :order="4">1 col-order-4</a-col>
      <a-col :span="6" :order="3">2 col-order-3</a-col>
      <a-col :span="6" :order="2">3 col-order-2</a-col>
      <a-col :span="6" :order="1">4 col-order-1</a-col>
    </a-row>
  </div>
</template>
```
