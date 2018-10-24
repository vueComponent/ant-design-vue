<template functional>
  <a-sub-menu v-on="listeners" v-bind="data.attrs">
    <span slot="title"><a-icon type="mail" /><span>{{data.attrs.menuInfo.title}}</span></span>
    <template v-for="item in data.attrs.menuInfo.children">
      <a-menu-item v-if="!item.children" :key="item.key">
        <a-icon type="pie-chart" />
        <span>{{item.title}}</span>
      </a-menu-item>
      <sub-menu v-else :menuInfo="item" :key="item.key"/>
    </template>
  </a-sub-menu>
</template>
