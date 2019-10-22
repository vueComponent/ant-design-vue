<cn>
#### 单文件递归菜单
使用单文件方式递归生成菜单。
因组件内部会动态更改`a-sub-menu`的属性，如果拆分成单文件，无法将属性挂载到`a-sub-menu`上，你需要自行声明属性并挂载。为了方便，避免属性的声明，我们推荐使用函数式组件。
</cn>

<us>
#### Single file recursive menu
Use the single file method to recursively generate menus.
The properties of `a-sub-menu` are dynamically changed inside the component. If you split the file into a single file and you cannot mount the `props` to `a-sub-menu`, you need to declare the `props` and mount it yourself. For convenience, to avoid the declaration of attributes, we recommend using functional components.
</us>

```tpl
<template>
  <div style="width: 256px">
    <a-button type="primary" @click="toggleCollapsed" style="margin-bottom: 16px">
      <a-icon :type="collapsed ? 'menu-unfold' : 'menu-fold'" />
    </a-button>
    <a-menu
      :defaultSelectedKeys="['1']"
      :defaultOpenKeys="['2']"
      mode="inline"
      theme="dark"
      :inlineCollapsed="collapsed"
    >
      <template v-for="item in list">
        <a-menu-item v-if="!item.children" :key="item.key">
          <a-icon type="pie-chart" />
          <span>{{item.title}}</span>
        </a-menu-item>
        <sub-menu v-else :menu-info="item" :key="item.key" />
      </template>
    </a-menu>
  </div>
</template>

<script>
  /*
   * recommend SubMenu.vue https://github.com/vueComponent/ant-design-vue/blob/master/components/menu/demo/SubMenu.vue
   * SubMenu1.vue https://github.com/vueComponent/ant-design-vue/blob/master/components/menu/demo/SubMenu1.vue
   * */
  import SubMenu from './SubMenu';
  export default {
    components: {
      'sub-menu': SubMenu,
    },
    data() {
      return {
        collapsed: false,
        list: [
          {
            key: '1',
            title: 'Option 1',
          },
          {
            key: '2',
            title: 'Navigation 2',
            children: [
              {
                key: '2.1',
                title: 'Navigation 3',
                children: [{ key: '2.1.1', title: 'Option 2.1.1' }],
              },
            ],
          },
        ],
      };
    },
    methods: {
      toggleCollapsed() {
        this.collapsed = !this.collapsed;
      },
    },
  };
</script>
```
