<cn>
#### 单位
通过前缀和后缀添加单位。
</cn>

<us>
#### Unit
Add unit through `prefix` and `suffix`.
</us>

```vue
<template>
  <a-row :gutter="16">
    <a-col :span="12">
      <a-statistic title="Feedback" :value="1128" style="margin-right: 50px">
        <template #suffix>
          <a-icon type="like" />
        </template>
      </a-statistic>
    </a-col>
    <a-col :span="12">
      <a-statistic title="Unmerged" :value="93" class="demo-class">
        <template #suffix>
          <span> / 100</span>
        </template>
      </a-statistic>
    </a-col>
  </a-row>
</template>
```
