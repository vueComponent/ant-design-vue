<template>
<div>
<md>
## 自定义分隔符
</md>
<Breadcrumb separator=">">
  <BreadcrumbItem>Home</BreadcrumbItem>
  <BreadcrumbItem href="">Application Center</BreadcrumbItem>
  <BreadcrumbItem href="">Application List</BreadcrumbItem>
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
