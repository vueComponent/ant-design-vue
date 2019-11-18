<cn>
#### 单位
通过前缀和后缀添加单位。
</cn>

<us>
#### Unit
Add unit through `prefix` and `suffix`.
</us>

```tpl
<template>
  <a-row :gutter="16">
    <a-col :span="12">
      <a-statistic title="Feedback" :value="1128" style="margin-right: 50px">
        <template v-slot:suffix>
          <a-icon type="like" />
        </template>
      </a-statistic>
    </a-col>
    <a-col :span="12">
      <a-statistic title="Unmerged" :value="93" valueClass="demo-class">
        <template v-slot:suffix>
          <span> / 100</span>
        </template>
      </a-statistic>
    </a-col>
  </a-row>
</template>
```
