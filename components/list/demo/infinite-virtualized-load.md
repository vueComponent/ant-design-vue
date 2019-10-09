<cn>
#### 滚动加载无限长列表
结合 [vue-virtual-scroller](https://github.com/Akryum/vue-virtual-scroller) 实现滚动加载无限长列表，带有虚拟化（[virtualization](https://blog.jscrambler.com/optimizing-react-rendering-through-virtualization/)）功能，能够提高数据量大时候长列表的性能。
可以结合 [vue-infinite-scroll](https://github.com/ElemeFE/vue-infinite-scroll) 实现滚动自动加载无限长列表。
`virtualized` 是在大数据列表中应用的一种技术，主要是为了减少不可见区域不必要的渲染从而提高性能，特别是数据量在成千上万条效果尤为明显。
</cn>

<us>
#### Infinite & virtualized
An example of infinite list & virtualized loading using [vue-virtual-scroller](https://github.com/Akryum/vue-virtual-scroller).
`Virtualized` rendering is a technique to mount big sets of data. It reduces the amount of rendered DOM nodes by tracking and hiding whatever isn't currently visible.
</us>

```tpl
<template>
  <a-list>
    <virtual-scroller
      style="height: 400px"
      :items="data"
      item-height="73"
      v-infinite-scroll="handleInfiniteOnLoad"
      :infinite-scroll-disabled="busy"
      :infinite-scroll-distance="10"
    >
      <a-list-item slot-scope="{item}">
        <a-list-item-meta :description="item.email">
          <a slot="title" :href="item.href">{{item.name.last}}</a>
          <a-avatar
            slot="avatar"
            src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
          />
        </a-list-item-meta>
        <div>Content {{item.index}}</div>
      </a-list-item>
    </virtual-scroller>
    <a-spin v-if="loading" class="demo-loading" />
  </a-list>
</template>
<script>
  import reqwest from 'reqwest';
  import infiniteScroll from 'vue-infinite-scroll';
  import { VirtualScroller } from 'vue-virtual-scroller';
  const fakeDataUrl = 'https://randomuser.me/api/?results=10&inc=name,gender,email,nat&noinfo';
  export default {
    directives: { infiniteScroll },
    data() {
      return {
        data: [],
        loading: false,
        busy: false,
      };
    },
    beforeMount() {
      this.fetchData(res => {
        this.data = res.results.map((item, index) => ({ ...item, index }));
      });
    },
    methods: {
      fetchData(callback) {
        reqwest({
          url: fakeDataUrl,
          type: 'json',
          method: 'get',
          contentType: 'application/json',
          success: res => {
            callback(res);
          },
        });
      },
      handleInfiniteOnLoad() {
        const data = this.data;
        this.loading = true;
        if (data.length > 100) {
          this.$message.warning('Infinite List loaded all');
          this.busy = true;
          this.loading = false;
          return;
        }
        this.fetchData(res => {
          this.data = data.concat(res.results).map((item, index) => ({ ...item, index }));
          this.loading = false;
        });
      },
    },
    components: {
      'virtual-scroller': VirtualScroller,
    },
  };
</script>
<style>
  .demo-loading {
    position: absolute;
    bottom: 40px;
    width: 100%;
    text-align: center;
  }
</style>
```
