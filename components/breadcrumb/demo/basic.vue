<template>
<div>
<md>
## 基本
</md>
<Breadcrumb>
  <BreadcrumbItem>Home</BreadcrumbItem>
  <BreadcrumbItem><a href="">Application Center</a></BreadcrumbItem>
  <BreadcrumbItem><a href="">Application List</a></BreadcrumbItem>
  <BreadcrumbItem>An Application</BreadcrumbItem>
</Breadcrumb>
</div>
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
