<cn>
#### 弹出位置
支持 6 个弹出位置。
</cn>

<us>
#### Placement
Support 6 placements.
</us>

```tpl
<template>
  <div id="components-dropdown-demo-placement">
    <template v-for="(placement, index) in placements">
      <a-dropdown :placement="placement">
        <a-button>{{placement}}</a-button>
        <a-menu slot="overlay">
          <a-menu-item>
            <a target="_blank" rel="noopener noreferrer" href="http://www.alipay.com/"
              >1st menu item</a
            >
          </a-menu-item>
          <a-menu-item>
            <a target="_blank" rel="noopener noreferrer" href="http://www.taobao.com/"
              >2nd menu item</a
            >
          </a-menu-item>
          <a-menu-item>
            <a target="_blank" rel="noopener noreferrer" href="http://www.tmall.com/"
              >3rd menu item</a
            >
          </a-menu-item>
        </a-menu>
      </a-dropdown>
      <br v-if="index === 2" />
    </template>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        placements: [
          'bottomLeft',
          'bottomCenter',
          'bottomRight',
          'topLeft',
          'topCenter',
          'topRight',
        ],
      };
    },
  };
</script>
<style>
  #components-dropdown-demo-placement .ant-btn {
    margin-right: 8px;
    margin-bottom: 8px;
  }
</style>
```
