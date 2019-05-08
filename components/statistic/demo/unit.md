<cn>
#### 单位
通过前缀和后缀添加单位。
</cn>

<us>
#### Unit
Add unit through `prefix` and `suffix`.
</us>

```html
<template>
  <div>
    <a-statistic
      title="Feedback"
      :value="11.28"
      :precision="2"
      suffix="%"
      :valueStyle="{color: '#3f8600'}"
      style="margin-right: 50px"
    >
      <a-icon slot="prefix" type="arrow-up" />
    </a-statistic>
    <a-statistic
      title="Unmerged"
      :value="78"
      valueClass="demo-class"
    >
      <span slot="suffix"> / 100</span>
    </a-statistic>
  </div>
</template>
```
