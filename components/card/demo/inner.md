<cn>
  #### 内部卡片
  可以放在普通卡片内部，展示多层级结构的信息
</cn>

<us>
  #### Inner card
  It can be placed inside the ordinary card to display the information of the multilevel structure
</us>

```tpl
<template>
  <a-card title="Card title">
    <p style="fontSize: 14px;color: rgba(0, 0, 0, 0.85); marginBottom: 16px;fontWeight: 500">
      Group title
    </p>
    <a-card title="Inner card title">
      <a href="#" slot="extra">More</a>
      Inner Card content
    </a-card>
    <a-card title="Inner card title" :style="{ marginTop: '16px' }">
      <a href="#" slot="extra">More</a>
      Inner Card content
    </a-card>
  </a-card>
</template>
```
