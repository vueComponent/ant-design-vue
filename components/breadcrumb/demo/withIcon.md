<cn>
  #### 带有图标的
  图标放在文字前面
</cn>

<us>
 #### With an Icon
 The icon should be placed in front of the text
</us>

```html
<template>
<Breadcrumb>
  <BreadcrumbItem href="">
    <Icon type="home" />
  </BreadcrumbItem>
  <BreadcrumbItem href="">
    <Icon type="user" />
    <span>Application List</span>
  </BreadcrumbItem>
  <BreadcrumbItem>
    Application
  </BreadcrumbItem>
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
