<cn>
#### 分段进度条
标准的进度条。
</cn>

<us>
#### Progress bar with success segment
A standard progress bar.
</us>

```vue
<template>
  <div>
    <a-tooltip title="3 done / 3 in progress / 4 to do">
      <a-progress :percent="60" :success-percent="30" />
    </a-tooltip>
    <a-tooltip title="3 done / 3 in progress / 4 to do">
      <a-progress :percent="60" :success-percent="30" type="circle" />
    </a-tooltip>
    <a-tooltip title="3 done / 3 in progress / 4 to do">
      <a-progress :percent="60" :success-percent="30" type="dashboard" />
    </a-tooltip>
  </div>
</template>
```
