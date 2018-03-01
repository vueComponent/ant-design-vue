<template>
  <header id='header'>
    <a-menu v-model="current" mode="horizontal" id="nav">
      <a-menu-item key='home'>
        首页
      </a-menu-item>
      <a-menu-item key='design'>
        设计语言
      </a-menu-item>
      <a-menu-item key='components'>
        组件
      </a-menu-item>
      <a-menu-item key='github'>
        <a href="https://github.com/vueComponent/ant-design">GitHub</a>
      </a-menu-item>
    </a-menu>
  </header>
</template>
<script>
export default {
  data () {
    return {
      current: ['components'],
    }
  },
}
</script>
