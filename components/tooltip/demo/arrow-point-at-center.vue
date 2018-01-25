<template>
<div>
<md>
## 箭头指向
设置了 `arrowPointAtCenter` 后，箭头将指向目标元素的中心。
</md>
  <a-tooltip placement="topLeft" title="Prompt Text">
    <a-button>Align edge / 边缘对齐</a-button>
  </a-tooltip>
  <a-tooltip placement="topLeft" title="Prompt Text" arrowPointAtCenter>
    <a-button>Arrow points to center / 箭头指向中心</a-button>
  </a-tooltip>
</div>
</template>
