<cn>
#### 其他属性的响应式
`span` `pull` `push` `offset` `order` 属性可以通过内嵌到 `xs` `sm` `md` `lg` `xl` `xxl` 属性中来使用。
其中 `:xs="6"` 相当于 `:xs="{ span: 6 }"`。
</cn>

<us>
#### More responsive
`span` `pull` `push` `offset` `order` property can be embedded into `xs` `sm` `md` `lg` `xl` properties to use,
where `:xs="6"` is equivalent to `:xs="{span: 6}"`.
</us>

```tpl
<template>
  <a-row>
    <a-col :xs="{ span: 5, offset: 1 }" :lg="{ span: 6, offset: 2 }">Col</a-col>
    <a-col :xs="{ span: 11, offset: 1 }" :lg="{ span: 6, offset: 2 }">Col</a-col>
    <a-col :xs="{ span: 5, offset: 1 }" :lg="{ span: 6, offset: 2 }">Col</a-col>
  </a-row>
</template>
```
