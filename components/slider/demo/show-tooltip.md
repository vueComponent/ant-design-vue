<cn>
#### 控制 ToolTip 的显示
当 `tooltipVisible` 为 `true` 时，将始终显示ToolTip；反之则始终不显示，即使在拖动、移入时也是如此。
</cn>

<us>
#### Control visible of ToolTip
When `tooltipVisible` is `true`, ToolTip will show always, or ToolTip will not show anyway, even if dragging or hovering.
</us>

```tpl
<template>
  <a-slider :defaultValue="30" :tooltipVisible="true" />
</template>
```
