<cn>
#### 适应文本高度的文本域
`autosize` 属性适用于 `textarea` 节点，并且只有高度会自动变化。另外 `autosize` 可以设定为一个对象，指定最小行数和最大行数。
</cn>

<us>
#### Autosizing the height to fit the content
`autosize` prop for a `textarea` type of `Input` makes the height to automatically adjust based on the content.
An options object can be provided to `autosize` to specify the minimum and maximum number of lines the textarea will automatically adjust.
</us>

```tpl
<template>
  <div>
    <a-textarea placeholder="Autosize height based on content lines" autosize />
    <div style="margin: 24px 0" />
    <a-textarea
      placeholder="Autosize height with minimum and maximum number of lines"
      :autosize="{ minRows: 2, maxRows: 6 }"
    />
  </div>
</template>
```
