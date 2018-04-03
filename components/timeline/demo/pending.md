<cn>
#### 最后一个
当任务状态正在发生，还在记录过程中，可用幽灵节点来表示当前的时间节点。（用于时间正序排列）
</cn>

<us>
#### Last node
When the timeline is incomplete and ongoing, put a ghost node at last. set `pending={true}` or `pending={a React Element}`. Used in ascend chronological order.
</us>

```html
<template>
  <a-timeline pending="Recording...">
    <a-timeline-item>Create a services site 2015-09-01</a-timeline-item>
    <a-timeline-item>Solve initial network problems 2015-09-01</a-timeline-item>
    <a-timeline-item>Technical testing 2015-09-01</a-timeline-item>
  </a-timeline>
</template>
```




