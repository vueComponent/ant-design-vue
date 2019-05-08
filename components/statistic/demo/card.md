<cn>
#### 在卡片中使用
在卡片中展示统计数值。
</cn>

<us>
#### In Card
Display statistic data in Card.
</us>

```html
<template>
  <div>
    <a-card style="padding: 30px">
      <a-statistic
        title="Feedback"
        :value="1128"
        style="margin-right: 50px"
      >
        <a-icon slot="prefix" type="like" />
      </a-statistic>
      <a-statistic
        title="Unmerged"
        :value="1234567890"
        valueClass="demo-class"
      >
        <span slot="suffix"> / 100</span>
      </a-statistic>
    </a-card>
  </div>
</template>
```
