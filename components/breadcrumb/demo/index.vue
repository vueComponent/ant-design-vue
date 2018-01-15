<template>
  <div>
    基本用法
    <Breadcrumb>
      <BreadcrumbItem>Home</BreadcrumbItem>
      <BreadcrumbItem><a href="">Application Center</a></BreadcrumbItem>
      <BreadcrumbItem><a href="">Application List</a></BreadcrumbItem>
      <BreadcrumbItem>An Application</BreadcrumbItem>
    </Breadcrumb>
    <br>
    带有图标
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
    <br>
    自定义分隔符
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
  data () {
    return {
    }
  },
  methods: {
  },
  components: {
    Icon,
    Breadcrumb,
    BreadcrumbItem: Breadcrumb.Item,
  },
}
</script>
