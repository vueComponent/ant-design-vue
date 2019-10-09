<cn>
  #### 更灵活的内容展示
  可以利用 `Card.Meta` 支持更灵活的内容
</cn>

<us>
  #### Customized content
  You can use `Card.Meta` to support more flexible content.
</us>

```tpl
<template>
  <a-card hoverable style="width: 240px">
    <img
      alt="example"
      src="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png"
      slot="cover"
    />
    <a-card-meta title="Europe Street beat">
      <template slot="description"
        >www.instagram.com</template
      >
    </a-card-meta>
  </a-card>
</template>
```
