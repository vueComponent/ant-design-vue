<cn>
  #### 分隔符
  使用` separator=">" `可以自定义分隔符
</cn>

<us>
  #### Configuring the Separator
  The separator can be customized by setting the separator preperty: separator=">"
</us>

```html
<template>
<Breadcrumb separator=">">
  <BreadcrumbItem>Home</BreadcrumbItem>
  <BreadcrumbItem href="">Application Center</BreadcrumbItem>
  <BreadcrumbItem href="">Application List</BreadcrumbItem>
  <BreadcrumbItem>An Application</BreadcrumbItem>
</Breadcrumb>
</template>

<script>
import '../style'
import { Icon, Breadcrumb } from 'antd/index'
export default {
  components: {
    Icon,
    Breadcrumb,
    BreadcrumbItem: Breadcrumb.Item,
  },
}
</script>

```
