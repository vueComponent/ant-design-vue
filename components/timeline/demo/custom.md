<cn>
#### 自定义时间轴点
基本的时间轴。
</cn>

<us>
#### Custom
Set a node as an icon or other custom element.
</us>

```tpl
<template>
  <a-timeline>
    <a-timeline-item>Create a services site 2015-09-01</a-timeline-item>
    <a-timeline-item>Solve initial network problems 2015-09-01</a-timeline-item>
    <a-timeline-item color="red">
      <a-icon slot="dot" type="clock-circle-o" style="font-size: 16px;" />
      Technical testing 2015-09-01
    </a-timeline-item>
    <a-timeline-item>Network problems being solved 2015-09-01</a-timeline-item>
  </a-timeline>
</template>
```
