<cn>
  #### 基本
  最简单的用法
</cn>

<us>
  #### Basic usage 
  The simplest use
</us>

```html
<template>
  <Breadcrumb>
    <BreadcrumbItem>Home</BreadcrumbItem>
    <BreadcrumbItem><a href="">Application Center</a></BreadcrumbItem>
    <BreadcrumbItem><a href="">Application List</a></BreadcrumbItem>
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
