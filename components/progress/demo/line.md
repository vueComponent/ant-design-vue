<cn>
#### 进度条
标准的进度条。
</cn>

<us>
#### Progress bar
A standard progress bar.
</us>

```tpl
<template>
  <div>
    <a-progress :percent="30" />
    <a-progress :percent="50" status="active" />
    <a-progress :percent="70" status="exception" />
    <a-progress :percent="100" />
    <a-progress :percent="50" :showInfo="false" />
  </div>
</template>
```
