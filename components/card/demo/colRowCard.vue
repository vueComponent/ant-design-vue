<template>
<div>
<md>
## 栅格卡片
</md>
<div style="background: #ECECEC; padding: 30px">
  <a-row :gutter="16">
    <a-col :span="8">
      <a-card title="Card title" :bordered="false">Card content</a-card>
    </a-col>
    <a-col :span="8">
      <a-card title="Card title" :bordered="false">Card content</a-card>
    </a-col>
    <a-col :span="8">
      <a-card title="Card title" :bordered="false">Card content</a-card>
    </a-col>
  </a-row>
</div>
</div>
</template>
