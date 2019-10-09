<cn>
#### 总数
通过设置 `showTotal` 展示总共有多少数据。
</cn>

<us>
#### Total number
You can show the total number of data by setting `showTotal`.
</us>

```tpl
<template>
  <div>
    <a-pagination
      :total="85"
      :showTotal="total => `Total ${total} items`"
      :pageSize="20"
      :defaultCurrent="1"
    />
    <br />
    <a-pagination
      :total="85"
      :showTotal="(total, range) => `${range[0]}-${range[1]} of ${total} items`"
      :pageSize="20"
      :defaultCurrent="1"
    />
  </div>
</template>
```
