<template>
<div>
<md>
## 带有图标
</md>
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
